"""
Redacts PII and confidential data from demand intake screenshots for public use.
Saves results to demandintake-public/. Originals are untouched.

Blur technique: crop region -> scale down -> scale back up (pixelate).
This is more visually clean than Gaussian blur and clearly signals redaction.
"""

from PIL import Image
import os

SRC = "/Users/nealmiran/Development/Websites/magic-portfolio/public/images/projects/demandintake"
DST = "/Users/nealmiran/Development/Websites/magic-portfolio/public/images/projects/demandintake-public"


def pixelate(img, x1, y1, x2, y2, block=40):
    """Pixelate a rectangular region of img in-place."""
    rw = max(1, x2 - x1)
    rh = max(1, y2 - y1)
    region = img.crop((x1, y1, x2, y2))
    small = region.resize((max(1, rw // block), max(1, rh // block)), Image.BOX)
    pixelated = small.resize((rw, rh), Image.NEAREST)
    img.paste(pixelated, (x1, y1))


def pct(img, x1p, y1p, x2p, y2p):
    """Convert percentage coords (0.0–1.0) to pixel coords for img."""
    w, h = img.size
    return int(x1p * w), int(y1p * h), int(x2p * w), int(y2p * h)


def redact(img, regions):
    for r in regions:
        pixelate(img, *r)
    return img


# ---------------------------------------------------------------------------
# intakelist.png  (4998 x 2366)
# Sensitive: requestor names, project names, BU numbers, BU names, analyst
# names, and the entire right detail panel.
# ---------------------------------------------------------------------------
def process_intakelist(img):
    w, h = img.size
    row_top = int(0.155 * h)   # top of first data row (below column headers)
    return redact(img, [
        # User avatar top-right in header
        pct(img, 0.952, 0.000, 1.000, 0.080),
        # Requestor name column
        pct(img, 0.060, row_top / h, 0.178, 1.000),
        # Project Name column
        pct(img, 0.260, row_top / h, 0.428, 1.000),
        # BU # column
        pct(img, 0.428, row_top / h, 0.508, 1.000),
        # BU Name column
        pct(img, 0.508, row_top / h, 0.628, 1.000),
        # Project Analyst column — extended to catch overflow
        pct(img, 0.855, row_top / h, 0.970, 1.000),
        # Entire right detail panel — start earlier to catch all content
        pct(img, 0.755, 0.000, 1.000, 1.000),
    ])


# ---------------------------------------------------------------------------
# newintake-01.png  (4988 x 2466)
# Empty form — only user avatar needs redacting.
# ---------------------------------------------------------------------------
def process_newintake_01(img):
    return redact(img, [
        pct(img, 0.952, 0.000, 1.000, 0.080),
    ])


# ---------------------------------------------------------------------------
# newintake-02.png  (4978 x 2452)
# Empty form — only user avatar.
# ---------------------------------------------------------------------------
def process_newintake_02(img):
    return redact(img, [
        pct(img, 0.952, 0.000, 1.000, 0.080),
    ])


# ---------------------------------------------------------------------------
# newintake-03.png  (4974 x 2448)
# Form filled with real data: name, email, sponsor, BU number, BU name.
# The form content sits to the right of the left sidebar (~x=16%).
# ---------------------------------------------------------------------------
def process_newintake_03(img):
    # Blur the entire form content area that contains real data.
    # The left sidebar (Intake Sections nav) is clean — only the right form pane needs redacting.
    return redact(img, [
        # User avatar
        pct(img, 0.952, 0.000, 1.000, 0.080),
        # Entire form content pane from below the header to below BU Name field
        pct(img, 0.160, 0.085, 0.995, 0.650),
    ])


# ---------------------------------------------------------------------------
# newintake-04.png  (4970 x 2454)
# Test date visible — blur it. No names.
# ---------------------------------------------------------------------------
def process_newintake_04(img):
    return redact(img, [
        # User avatar
        pct(img, 0.952, 0.000, 1.000, 0.080),
        # Desired Timeline date value
        pct(img, 0.160, 0.630, 0.700, 0.700),
    ])


# ---------------------------------------------------------------------------
# newintake-05.png  (4972 x 2466)
# Generic placeholder text — only user avatar.
# ---------------------------------------------------------------------------
def process_newintake_05(img):
    return redact(img, [
        pct(img, 0.952, 0.000, 1.000, 0.080),
    ])


# ---------------------------------------------------------------------------
# newintake-06.png  (4980 x 2462)
# Attachments step — no real data, only user avatar.
# ---------------------------------------------------------------------------
def process_newintake_06(img):
    return redact(img, [
        pct(img, 0.952, 0.000, 1.000, 0.080),
    ])


# ---------------------------------------------------------------------------
# intakedetails.png  (4974 x 2460)
# Very sensitive: full names, email, BU, activity comments on the right.
# Left sidebar has assigned-user dropdowns. Right sidebar has comment thread.
# ---------------------------------------------------------------------------
def process_intakedetails(img):
    return redact(img, [
        # User avatar
        pct(img, 0.952, 0.000, 1.000, 0.080),
        # Left sidebar — all assigned user / role fields
        pct(img, 0.000, 0.065, 0.200, 0.900),
        # Entire center content pane — covers all field values (ID, banner,
        # analyst, contact info, BU, sponsor, business impact text)
        pct(img, 0.200, 0.065, 0.805, 0.980),
        # Right activity sidebar — comment thread with real names and text
        pct(img, 0.805, 0.065, 1.000, 1.000),
    ])


# ---------------------------------------------------------------------------
# greencosts.png  (4980 x 2464)
# Modal shows Intake ID and "02840 - Administrative Cost Centre" BU.
# ---------------------------------------------------------------------------
def process_greencosts(img):
    return redact(img, [
        # User avatar
        pct(img, 0.952, 0.000, 1.000, 0.080),
        # Entire modal body (everything below the modal title bar)
        pct(img, 0.295, 0.210, 0.705, 0.690),
    ])


# ---------------------------------------------------------------------------
# browncosts.png  (4974 x 2450)
# Modal shows Intake ID, "Neal Miran" as Resource, department name.
# ---------------------------------------------------------------------------
def process_browncosts(img):
    return redact(img, [
        # User avatar
        pct(img, 0.952, 0.000, 1.000, 0.080),
        # Entire modal body (everything below the modal title bar)
        pct(img, 0.295, 0.210, 0.705, 0.690),
    ])


# ---------------------------------------------------------------------------
# insights-dashboard.png  (4978 x 2460)
# Power BI dashboard: BU names in chart, requestor names in table,
# team names in treemap and bar chart.
# ---------------------------------------------------------------------------
def process_insights(img):
    return redact(img, [
        # "Intake Count by BU Name" — y-axis labels (BU names)
        pct(img, 0.010, 0.055, 0.175, 0.535),
        # "Requestors" table — rows with names and counts
        pct(img, 0.278, 0.055, 0.490, 0.510),
        # "Intakes by Team" treemap — contains real team/group names
        pct(img, 0.390, 0.510, 0.695, 0.980),
        # "Hours by Assigned Team" — x-axis team name labels
        pct(img, 0.695, 0.800, 0.995, 0.980),
    ])


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

processors = {
    "intakelist.png":      process_intakelist,
    "newintake-01.png":    process_newintake_01,
    "newintake-02.png":    process_newintake_02,
    "newintake-03.png":    process_newintake_03,
    "newintake-04.png":    process_newintake_04,
    "newintake-05.png":    process_newintake_05,
    "newintake-06.png":    process_newintake_06,
    "intakedetails.png":   process_intakedetails,
    "greencosts.png":      process_greencosts,
    "browncosts.png":      process_browncosts,
    "insights-dashboard.png": process_insights,
}

for filename, fn in processors.items():
    src_path = os.path.join(SRC, filename)
    dst_path = os.path.join(DST, filename)
    img = Image.open(src_path).convert("RGB")
    img = fn(img)
    img.save(dst_path, "PNG", optimize=False)
    print(f"  saved {filename}")

print("\nDone. Redacted images in demandintake-public/")
