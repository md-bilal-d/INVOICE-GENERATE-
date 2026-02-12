# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

## [2.0.0] - 2026-02-12
### Major Redesign (Sunrise Theme)
- **Layout Overhaul**: Completely matched the visual style of "Sunrise Enterprise".
- **New Fields Added**:
    - **Item Details**: HSN Code, Unit (Nos/Box/etc).
    - **Transport Details**: Vehicle Number, Transport Mode, Delivery Date, Terms.
    - **Bank Details**: Bank Name, A/C No, IFSC, UPI.
    - **Tax Split**: Auto-calculation of CGST and SGST.
- **Styling**:
    - Blue header theme.
    - Compact professional grid borders.
    - Specific "Bill To" and "Ship To" layout.
- **Functionality**:
    - "Ship to same address" toggle.
    - Smart text updates for all new fields.

## [1.0.4] - 2026-02-12
### Added
- **Logo Resizer**: Added a slider to adjust company logo size from 50px to 300px.
- **Editable Order Details**: Added input fields to manually change "Order Number", "Order Date", and "Invoice Date".
- **QR Code**: Added specific QR code generation that includes Invoice details (ID, Date, Total).
- **Advanced Number to Words**: Implemented a full converter for amounts supporting Indian Numbering System (Lakhs/Crores) to display "Rupees [Amount] Only".

## [1.0.3] - 2026-02-12
### Added
- **Company Details Section**: Added input fields for "Company Name", "Address", "City, State, Zip", "PAN No", and "GST No" in the sidebar.
- **Real-time Updates**: updates the "Sold By" section of the invoice immediately upon typing.
- **Clean Print**: Optimized `@media print` CSS to remove margins and shadows, ensuring a single-page PDF generation.

## [1.0.2] - 2026-02-12
### Changed
- **Professional Theme**: Redesigned the invoice layout to match standard professional invoice formats (Grid based).
- **Invoice Structure**: separated "Sold By" and "Billing/Shipping Address".
- **Table Columns**: Added "Quantity", "Tax Rate", "Tax Amount", and "Net Amount" columns.
- **Calculations**: Updated JavaScript to handle `Qty * Price` and Tax calculations.
- **Footer**: Added "Amount in Words" and "Authorized Signatory" sections.

## [1.0.1] - 2026-02-12
### Added
- **Basic Invoice Generator**: Initial HTML, CSS, and JS implementation.
- **Features**: Add items, calculate total, print/save as PDF.
- **Styling**: Basic card-based layout.
