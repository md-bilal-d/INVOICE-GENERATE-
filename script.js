/* =========================================
   INVOICE GENERATOR SCRIPT V3.1
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

    // -- CONFIG --
    // API Key provided by user for QR generation
    const QR_API_KEY = "VYg84LFa8cFN-o-vxPBOsiVip9I6mQ7s9tsj-a86uv5pN61mOXzlBLMLgLkTK5ok";

    // -- STATE --
    const state = {
        items: []
    };

    // -- BIND INPUTS --
    const bindings = [
        ['inp-comp-name', 'out-comp-name'],
        ['inp-comp-addr', 'out-comp-addr'],
        ['inp-comp-gst', 'out-comp-gst'],
        ['inp-comp-contact', 'out-comp-contact'],
        ['inp-inv-no', 'out-inv-no'],
        ['inp-inv-date', 'out-inv-date', formatDate],
        ['inp-ord-no', 'out-ord-no'],
        ['inp-trans-mode', 'out-trans-mode'],
        ['inp-veh-no', 'out-veh-no'],
        ['inp-supply-place', 'out-supply-place'],
        ['inp-bill-name', 'out-bill-name'],
        ['inp-bill-addr', 'out-bill-addr'],
        ['inp-bill-gst', 'out-bill-gst'],
        ['inp-ship-name', 'out-ship-name'],
        ['inp-ship-addr', 'out-ship-addr'],
        ['inp-bank-name', 'out-bank-name'],
        ['inp-bank-ac', 'out-bank-ac'],
        ['inp-bank-ifsc', 'out-bank-ifsc'],
        ['inp-bank-upi', 'out-bank-upi']
    ];

    bindings.forEach(([inId, outId, transform]) => {
        const inp = document.getElementById(inId);
        const out = document.getElementById(outId);
        if (inp && out) {
            inp.addEventListener('input', () => {
                out.textContent = transform ? transform(inp.value) : inp.value;
                if (['inp-inv-no', 'inp-inv-date', 'inp-bank-upi', 'inp-comp-name'].includes(inId)) updateQR();
            });
        }
    });

    // -- HANDLERS --

    // Ship To Sync
    const chkSameShip = document.getElementById('chk-same-ship');
    function syncShipping() {
        const shipInputs = document.getElementById('ship-inputs');
        if (chkSameShip.checked) {
            shipInputs.style.display = 'none';
            document.getElementById('out-ship-name').textContent = document.getElementById('inp-bill-name').value;
            document.getElementById('out-ship-addr').textContent = document.getElementById('inp-bill-addr').value;
        } else {
            shipInputs.style.display = 'block';
            document.getElementById('out-ship-name').textContent = document.getElementById('inp-ship-name').value;
            document.getElementById('out-ship-addr').textContent = document.getElementById('inp-ship-addr').value;
        }
    }
    chkSameShip.addEventListener('change', syncShipping);
    document.getElementById('inp-bill-name').addEventListener('input', syncShipping);
    document.getElementById('inp-bill-addr').addEventListener('input', syncShipping);

    // Logo
    document.getElementById('inp-logo').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                const img = document.getElementById('out-logo');
                img.src = ev.target.result;
                img.style.display = 'block';
                document.getElementById('logo-placeholder').style.display = 'none';
            }
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('inp-logo-size').addEventListener('input', (e) => {
        document.getElementById('out-logo').style.maxHeight = e.target.value + 'px';
    });


    // -- ADD ITEM --
    const btnAdd = document.getElementById('btn-add-item');
    btnAdd.addEventListener('click', (e) => {
        e.preventDefault(); // Safety FIRST

        const desc = document.getElementById('inp-item-desc').value;
        const hsn = document.getElementById('inp-item-hsn').value;
        const unit = document.getElementById('inp-item-unit').value || 'Nos';
        const price = parseFloat(document.getElementById('inp-item-price').value) || 0;
        const qty = parseFloat(document.getElementById('inp-item-qty').value) || 0; // Default to 0 to force user input or handle blank
        const tax = parseFloat(document.getElementById('inp-item-tax').value) || 0;

        if (!desc) {
            alert("Please enter description");
            return;
        }
        if (qty <= 0) {
            alert("Please enter valid quantity");
            return;
        }

        const item = {
            id: Date.now() + Math.random(), // Unique ID
            desc, hsn, unit, price, qty, tax
        };

        state.items.push(item);
        renderItems();

        clearItemInputs();
    });

    // -- CLEAR ITEM --
    const btnClear = document.getElementById('btn-clear-item');
    if (btnClear) {
        btnClear.addEventListener('click', clearItemInputs);
    }

    function clearItemInputs() {
        document.getElementById('inp-item-desc').value = '';
        document.getElementById('inp-item-hsn').value = '';
        document.getElementById('inp-item-unit').value = '';
        document.getElementById('inp-item-price').value = '';
        document.getElementById('inp-item-qty').value = '';
        document.getElementById('inp-item-desc').focus();
    }

    window.deleteItem = function (id) {
        state.items = state.items.filter(i => i.id !== id);
        renderItems();
    };

    function renderItems() {
        const tbody = document.getElementById('items-body');
        tbody.innerHTML = '';
        let totalTaxable = 0;
        let totalTax = 0;
        let grandTotal = 0;

        state.items.forEach((item, index) => {
            const taxable = item.price * item.qty;
            const taxAmt = taxable * (item.tax / 100);
            const lineTotal = taxable + taxAmt;

            totalTaxable += taxable;
            totalTax += taxAmt;
            grandTotal += lineTotal;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td><strong>${item.desc}</strong></td>
                <td>${item.hsn}</td>
                <td>${item.qty}</td>
                <td>${item.unit}</td>
                <td class="text-right">${item.price.toFixed(2)}</td>
                <td class="text-right">${taxable.toFixed(2)}</td>
                <td class="text-right"><strong>${lineTotal.toFixed(2)}</strong></td>
                <td class="no-print"><button onclick="deleteItem(${item.id})" style="color:red;border:none;cursor:pointer;">&times;</button></td>
            `;
            tbody.appendChild(tr);
        });

        // Update Totals
        document.getElementById('sum-taxable').textContent = totalTaxable.toFixed(2);

        const cgst = totalTax / 2;
        const sgst = totalTax / 2;
        document.getElementById('sum-cgst').textContent = cgst.toFixed(2);
        document.getElementById('sum-sgst').textContent = sgst.toFixed(2);
        document.getElementById('sum-igst').textContent = "0.00";

        const final = Math.round(grandTotal);
        document.getElementById('sum-total').textContent = final.toFixed(2);
        document.getElementById('out-amount-words').textContent = convertNumberToWords(final) + " Only";

        updateQR(final);
    }

    // -- HELPERS --

    function formatDate(str) {
        if (!str) return '';
        const [y, m, d] = str.split('-');
        return `${d}/${m}/${y}`;
    }

    function updateQR(amt) {
        // Prepare Data for UPI
        const upiId = document.getElementById('inp-bank-upi').value;
        const payeeName = document.getElementById('inp-comp-name').value || 'Merchant';
        const invNo = document.getElementById('inp-inv-no').value || 'INV';
        // Get amount from argument or DOM, ensure 2 decimal places
        let finalAmt = amt !== undefined ? amt : document.getElementById('sum-total').textContent;
        finalAmt = parseFloat(finalAmt).toFixed(2);

        const img = document.getElementById('out-qr');

        // Only generate if we have a UPI ID and a non-zero amount
        if (!upiId || parseFloat(finalAmt) <= 0) {
            img.style.display = 'none';
            return;
        }

        // Construct UPI URI
        // pa = Payee Address, pn = Payee Name, am = Amount, tr = Transaction Ref, tn = Note
        const upiData = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${finalAmt}&tr=${invNo}&tn=Inv ${invNo}`;

        // Generate QR code using the UPI URI as data
        const url = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(upiData)}`;

        img.src = url;
        img.style.display = 'block';
    }

    function convertNumberToWords(amount) {
        const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
        const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
        const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

        const num = parseInt(amount);
        if (num === 0) return "Zero";

        function convertChunk(n) {
            if (n < 10) return units[n];
            if (n < 20) return teens[n - 10];
            if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + units[n % 10] : "");
            if (n < 1000) return units[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + convertChunk(n % 100) : "");
            return "";
        }

        let str = "";
        let n = num;

        if (n >= 10000000) { str += convertChunk(Math.floor(n / 10000000)) + " Crore "; n %= 10000000; }
        if (n >= 100000) { str += convertChunk(Math.floor(n / 100000)) + " Lakh "; n %= 100000; }
        if (n >= 1000) { str += convertChunk(Math.floor(n / 1000)) + " Thousand "; n %= 1000; }
        str += convertChunk(n);

        return "Rupees " + str.trim();
    }

    // Init
    document.getElementById('inp-inv-date').valueAsDate = new Date();
    document.getElementById('inp-inv-date').dispatchEvent(new Event('input'));
    document.getElementById('btn-print').addEventListener('click', () => window.print());

});
