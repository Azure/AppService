---
title: "Low-Light Image Enhancer (Python + OpenCV) on Azure App Service"
author_name: "Tulika Chaudharie"
toc: true
toc_sticky: true
---

Low-light photos are everywhere: indoor team shots, dim restaurant pics, grainy docs. This post shows a tiny Python app (Flask + OpenCV) that fixes them with explainable image processing—not a heavyweight model. We’ll walk the code that does the real work (CLAHE → gamma → brightness → subtle saturation) and deploy it to **Azure App Service for Linux**.

---

## What you’ll build

A Flask web app that accepts an image upload, runs a fast enhancement pipeline (CLAHE → gamma → brightness → subtle saturation), and returns **base64 data URIs** for an instant before/after view in the browser—no storage required for the basic demo.

---

## Architecture at a glance

1. **Browser → `/enhance`** (multipart form): sends an image + optional tunables (`clip_limit`, `gamma`, `brightness`).
2. **Flask → Enhancer**: converts the upload to a NumPy RGB array and calls `LowLightEnhancer.enhance_image(...)`.
3. **Response**: returns JSON with `original` and `enhanced` images as base64 PNG data URIs for immediate rendering.

---

## Prerequisites

* An Azure subscription
* [**Azure Developer CLI (`azd`)**](https://aka.ms/azd) installed
* (Optional) Python 3.9+ on your dev box for reading the code or extending it

---

## Deploy with `azd`

```bash
git clone https://github.com/Azure-Samples/appservice-ai-samples.git
cd appservice-ai-samples/lowlight-enhancer
azd init
azd up
```

When `azd up` finishes, open the printed URL, upload a low-light photo, and compare the result side-by-side.

---

## Code walkthrough (the parts that matter)

### 1) Flask surface area (`app.py`)

* **File size guard**:

```python
app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB
```

* **Two routes**:

  * `GET /` → renders the simple UI
  * `POST /enhance` → the JSON API the UI calls via XHR/fetch

* **Parameter handling with sane defaults**:

```python
clip_limit = float(request.form.get('clip_limit', 2.0))
gamma      = float(request.form.get('gamma', 1.2))
brightness = float(request.form.get('brightness', 1.1))
```

---

### 2) Zero-temp-file processing + data-URI response (`app.py`)

`process_uploaded_image` keeps the hot path tight: convert to RGB → enhance → convert both versions to **base64 PNG** and return them inline.

```python
def process_uploaded_image(file_storage, clip_limit=2.0, gamma=1.2, brightness=1.1):
    # PIL → NumPy (RGB)
    img_pil = Image.open(file_storage)
    if img_pil.mode != 'RGB':
        img_pil = img_pil.convert('RGB')
    img_array = np.array(img_pil)

    # Enhance
    enhanced = LowLightEnhancer().enhance_image(
        img_array, clip_limit=clip_limit, gamma=gamma, brightness_boost=brightness
    )

    # Back to base64 data URIs for instant display
    def pil_to_base64(pil_img):
        buf = io.BytesIO(); pil_img.save(buf, format='PNG')
        return base64.b64encode(buf.getvalue()).decode('utf-8')

    enhanced_pil = Image.fromarray(enhanced)
    return {
        'original': f'data:image/png;base64,{pil_to_base64(img_pil)}',
        'enhanced': f'data:image/png;base64,{pil_to_base64(enhanced_pil)}'
    }
```

---

### 3) The enhancement core (`enhancer.py`)

`LowLightEnhancer` implements a classic pipeline that runs great on CPU:

```python
class LowLightEnhancer:
    def __init__(self):
        self.clip_limit = 2.0
        self.tile_grid_size = (8, 8)

    def enhance_image(self, image, clip_limit=2.0, gamma=1.2, brightness_boost=1.1):
        # Normalize to RGB if the input came in as OpenCV BGR
        is_bgr = self._detect_bgr(image)
        rgb    = cv2.cvtColor(image, cv2.COLOR_BGR2RGB) if is_bgr else image

        # 1) CLAHE on L-channel (LAB) for local contrast without color blowout
        lab = cv2.cvtColor(rgb, cv2.COLOR_RGB2LAB)
        l, a, b = cv2.split(lab)
        clahe = cv2.createCLAHE(clipLimit=clip_limit, tileGridSize=self.tile_grid_size)
        l = clahe.apply(l)

        # 2) Gamma correction (perceptual brightness curve)
        l = self._apply_gamma_correction(l, gamma)

        # 3) Gentle overall lift
        l = np.clip(l * brightness_boost, 0, 255).astype(np.uint8)

        # Recombine + small saturation nudge for a natural look
        enhanced = cv2.cvtColor(cv2.merge([l, a, b]), cv2.COLOR_LAB2RGB)
        enhanced = self._boost_saturation(enhanced, factor=1.1)
        return cv2.cvtColor(enhanced, cv2.COLOR_RGB2BGR) if is_bgr else enhanced
```

* **CLAHE on L** (not RGB) avoids the “oversaturated neon” artifact common with naive histogram equalization.
* **Gamma via LUT** (below) is fast and lets you brighten mid-tones without crushing highlights.
* A tiny **brightness multiplier** brings the image up just a bit after contrast/curve changes.
* A **+10% saturation** helps counter the desaturation that often follows brightening.

---

### 4) Fast gamma with a lookup table (`enhancer.py`)

```python
def _apply_gamma_correction(self, image, gamma: float) -> np.ndarray:
    inv_gamma = 1.0 / gamma
    table = np.array([((i / 255.0) ** inv_gamma) * 255 for i in range(256)], dtype=np.uint8)
    return cv2.LUT(image, table)
```

Notes:

* With `gamma = 1.2`, `inv_gamma ≈ 0.833` → curve brightens mid-tones (exponent < 1).
* `cv2.LUT` applies the 256-entry mapping efficiently across the image.

---

### 5) Bounded color pop: subtle saturation boost (`enhancer.py`)

```python
def _boost_saturation(self, image: np.ndarray, factor: float) -> np.ndarray:
    hsv = cv2.cvtColor(image, cv2.COLOR_RGB2HSV).astype(np.float32)
    hsv[:, :, 1] = np.clip(hsv[:, :, 1] * factor, 0, 255)
    return cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2RGB)
```

Notes:

* Working in **HSV** keeps hue and brightness stable while gently lifting color.
* The clip to `[0, 255]` prevents out-of-gamut surprises.

---


## Tuning cheatsheet (which knob to turn, and when)

* **Too flat / muddy** → raise `clip_limit` from **2.0 → 3.0–4.0** (more local contrast).
* **Still too dark** → raise `gamma` from **1.2 → 1.4–1.6** (brightens mid-tones).
* **Harsh or “crunchy”** → lower `clip_limit`, or drop `brightness_boost` to **1.05–1.1**.
* **Colors feel washed out** → increase saturation factor a touch (e.g., **1.1 → 1.15**).

---

## What to try next

* Expose more controls in the UI (e.g., tile grid size, saturation factor).
* Persist originals/results to **Azure Blob Storage** and add shareable links.
* Add a background job for **batch processing** using the CLI helper.

---

## Conclusion

The complete sample code and deployment templates are available in the [appservice-ai-samples repository](https://github.com/Azure-Samples/appservice-ai-samples/)

Ready to build your own AI chat app? Clone the repo and run azd up to get started in minutes!

For more Azure App Service AI samples and best practices, check out the [Azure App Service AI integration documentation](https://learn.microsoft.com/azure/app-service/overview-ai-integration)
