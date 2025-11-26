document.addEventListener('DOMContentLoaded', function () {
            setCurrentDateTime();
            generateBillNumber();
            addRow(); // Add first row by default
        });

        function setCurrentDateTime() {
            const now = new Date();
            document.getElementById('billDate').valueAsDate = now;
            document.getElementById('billTime').value = now.toTimeString().slice(0, 5);
        }

        function generateBillNumber() {
            const date = new Date();
            const billPrefix = 'ASS';
            const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
            const dateString = date.getFullYear().toString().substr(-2) +
                (date.getMonth() + 1).toString().padStart(2, '0') +
                date.getDate().toString().padStart(2, '0');
            document.getElementById('billNo').value = `${billPrefix}-${dateString}-${randomPart}`;
        }

        async function fetchProducts() {
            try {
                const response = await fetch('http://localhost:8000/products/');
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const products = await response.json();
                console.log('Products fetched:', products); // Debug log
                if (!Array.isArray(products) || products.length === 0) {
                    console.warn('No products returned from server');
                    alert('No products available.');
                    return;
                }
                const tbody = document.getElementById('productTableBody');
                tbody.innerHTML = ''; // Clear existing rows
                products.forEach(product => {
                    const row = tbody.insertRow();
                    row.insertCell(0).innerText = product.product_id || 'N/A';
                    row.insertCell(1).innerText = product.product_name || 'N/A';
                    // Safely handle rate_per_unit
                    const rate = parseFloat(product.rate_per_unit);
                    row.insertCell(2).innerText = isNaN(rate) ? '0.00' : rate.toFixed(2);
                    row.insertCell(3).innerText = product.stock || 0;
                });
            } catch (error) {
                console.error('Fetch error:', error);
                alert(`Error fetching products: ${error.message}`);
            }
        }

        async function fetchMembershipStatus() {
            const customerPhone = document.getElementById('customerPhone').value;
            if (!customerPhone) {
                alert("Please enter a phone number.");
                return;
            }
            if (!/^\d{10}$/.test(customerPhone)) {
                alert("Please enter a valid 10-digit phone number.");
                return;
            }
            try {
                const response = await fetch(`http://localhost:8000/customers/?phone_number=${customerPhone}`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const customers = await response.json();
                if (customers.length > 0) {
                    const customer = customers[0];
                    document.getElementById('displayCustomerId').innerText = customer.customer_id;
                    document.getElementById('displayCustomerPhone').innerText = customer.phone_number;
                    document.getElementById('displayMembershipStatus').innerText = customer.membership_status;
                    document.getElementById('displayMembershipStatus').className =
                        customer.membership_status === 'Active Member' ? 'membership-active' : 'membership-inactive';
                    document.getElementById('customer-form').style.display = 'none';
                    document.getElementById('bill').style.display = 'flex';
                    await fetchProducts(); // Fetch products after showing bill page
                } else {
                    alert("Customer not found. Please register as a new customer.");
                    document.getElementById('newCustomerForm').style.display = 'block';
                    document.getElementById('customerPhone').disabled = true;
                }
            } catch (error) {
                console.error('Fetch error:', error);
                alert(`Error checking customer status. Please try again. Details: ${error.message}`);
            }
        }

        async function registerNewCustomer() {
            const customerId = document.getElementById('customerId').value;
            const customerPhone = document.getElementById('customerPhone').value;
            const customerName = document.getElementById('customerName').value;
            const customerEmail = document.getElementById('customerEmail').value;
            const customerAddress = document.getElementById('customerAddress').value;
            const startDate = document.getElementById('startDate').value;
            const expiryDate = document.getElementById('expiryDate').value;
            const membershipStatus = document.getElementById('membershipStatus').value;

            if (!customerId || !customerName || !startDate || !expiryDate) {
                alert("Please fill in all required fields (Customer ID, Name, Start Date, Expiry Date).");
                return;
            }

            const newCustomer = {
                customer_id: customerId,
                customer_name: customerName,
                phone_number: customerPhone,
                email: customerEmail || null,
                address: customerAddress || null,
                start_date: startDate,
                expiry_date: expiryDate,
                membership_status: membershipStatus
            };

            try {
                const response = await fetch('http://localhost:8000/customers/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newCustomer)
                });
                if (response.ok) {
                    const customer = await response.json();
                    document.getElementById('displayCustomerId').innerText = customer.customer_id;
                    document.getElementById('displayCustomerPhone').innerText = customer.phone_number;
                    document.getElementById('displayMembershipStatus').innerText = customer.membership_status;
                    document.getElementById('displayMembershipStatus').className =
                        customer.membership_status === 'Active Member' ? 'membership-active' : 'membership-inactive';
                    document.getElementById('customer-form').style.display = 'none';
                    document.getElementById('bill').style.display = 'block';
                    await fetchProducts(); // Fetch products after registration
                } else {
                    const errorData = await response.json();
                    alert(`Error registering customer: ${errorData.detail}`);
                }
            } catch (error) {
                console.error('Error registering customer:', error);
                alert("Error registering customer. Please try again.");
            }
        }

        function addRow() {
            const tbody = document.getElementById('billTableBody');
            const row = tbody.insertRow();
            row.insertCell(0).innerHTML = '<input type="text" placeholder="Sales ID" class="sales-id">';
            row.insertCell(1).innerHTML = '<input type="text" placeholder="Product ID" class="product-id" onblur="validateProductId(this)">';
            row.insertCell(2).innerHTML = '<input type="text" placeholder="Item Name" class="item-name">';
            row.insertCell(3).innerHTML = '<input type="number" min="1" value="1" placeholder="Qty" oninput="calculateRowAmount(this)">';
            row.insertCell(4).innerHTML = '<input type="number" min="0" step="0.01" placeholder="Rate" oninput="calculateRowAmount(this)">';
            row.insertCell(5).innerHTML = '<input type="text" placeholder="0.00" readonly>';
        }

        function removeRow() {
            const tbody = document.getElementById('billTableBody');
            if (tbody.rows.length > 0) {
                tbody.deleteRow(tbody.rows.length - 1);
                calculateTotal();
            }
        }

        function calculateRowAmount(input) {
            const row = input.closest('tr');
            const qty = parseFloat(row.cells[3].querySelector('input').value) || 0;
            const rate = parseFloat(row.cells[4].querySelector('input').value) || 0;
            row.cells[5].querySelector('input').value = (qty * rate).toFixed(2); // Update Amount cell
            calculateTotal();
        }

        function calculateTotal() {
            let subtotal = 0;
            document.querySelectorAll('#billTableBody tr').forEach(row => {
                const amt = parseFloat(row.cells[5].querySelector('input').value) || 0;
                subtotal += amt;
            });
            document.getElementById('subtotalAmount').innerText = subtotal.toFixed(2);
            const isMember = document.getElementById('displayMembershipStatus').innerText === 'Active Member';
            let discount = 0;
            if (isMember) {
                discount = subtotal * 0.05;
                document.getElementById('discountAmount').innerText = discount.toFixed(2);
            }
            document.getElementById('totalAmount').innerText = (subtotal - discount).toFixed(2);
        }

        async function printBill() {
            const rows = document.querySelectorAll('#billTableBody tr');
            let hasValidItems = false;
            const salesData = [];
            let currentSalesId = null;

            // Validate rows and collect data
            for (let row of rows) {
                const salesId = row.cells[0].querySelector('input').value.trim();
                const productId = row.cells[1].querySelector('input').value.trim();
                const itemName = row.cells[2].querySelector('input').value.trim();
                const qty = parseInt(row.cells[3].querySelector('input').value) || 0;
                const rate = parseFloat(row.cells[4].querySelector('input').value) || 0;
                const amount = parseFloat(row.cells[5].querySelector('input').value) || 0;

                console.log('Row data:', { salesId, productId, itemName, qty, rate, amount });

                if (salesId && productId && itemName && qty > 0 && amount > 0) {
                    hasValidItems = true;
                    currentSalesId = salesId;
                    salesData.push({
                        sales_id: salesId,
                        product_id: productId,
                        quantity: qty,
                        total_amount: amount
                    });
                }
            }

            if (!hasValidItems) {
                alert("Please add at least one valid item with Sales ID, Product ID, Item Name, Quantity, and Amount.");
                return;
            }

            // Prepare data for sales table
            const sale = {
                sales_id: currentSalesId,
                customer_id: document.getElementById('displayCustomerId').innerText,
                sales_date: document.getElementById('billDate').value,
                payment_method: document.getElementById('paymentMethod').value
            };

            console.log('Sale data to be sent:', sale);
            console.log('Sales details data to be sent:', salesData);

            try {
                // Test server connectivity first
                console.log('Testing server connectivity...');
                const testResponse = await fetch('http://localhost:8000/products/', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
        
                if (!testResponse.ok) {
                    throw new Error(`Server not responding. Status: ${testResponse.status}`);
                }
                console.log('Server connectivity test passed');

                // Save to sales table
                console.log('Saving sale...');
                const saleResponse = await fetch('http://localhost:8000/sales/', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(sale)
                });
        
                console.log('Sale response status:', saleResponse.status);
        
                if (!saleResponse.ok) {
                    const errorText = await saleResponse.text();
                    console.error('Sale error response text:', errorText);
            
                    try {
                        const errorData = JSON.parse(errorText);
                        console.error('Sale error response JSON:', errorData);
                        alert(`Error saving sale: ${JSON.stringify(errorData.detail || errorData)}`);
                    } catch (parseError) {
                        console.error('Failed to parse error response:', parseError);
                        alert(`Error saving sale. Server response: ${errorText}`);
                    }
                    return;
                }

                const saleResult = await saleResponse.json();
                console.log('Sale saved successfully:', saleResult);

                // Save to sales_details table
                for (let i = 0; i < salesData.length; i++) {
                    const item = salesData[i];
                    console.log(`Saving sales detail ${i + 1}/${salesData.length}:`, item);
            
                    const salesDetail = {
                        sales_id: item.sales_id,
                        product_id: item.product_id,
                        quantity: item.quantity,
                        total_amount: item.total_amount
                    };
            
                    const detailResponse = await fetch('http://localhost:8000/sales_details/', {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify(salesDetail)
                    });
            
                    console.log(`Sales detail ${i + 1} response status:`, detailResponse.status);
            
                    if (!detailResponse.ok) {
                        const errorText = await detailResponse.text();
                        console.error(`Sales detail ${i + 1} error response text:`, errorText);
                
                        try {
                            const errorData = JSON.parse(errorText);
                            console.error(`Sales detail ${i + 1} error response JSON:`, errorData);
                            alert(`Error saving sales detail for Product ID ${item.product_id}: ${JSON.stringify(errorData.detail || errorData)}`);
                        } catch (parseError) {
                            console.error('Failed to parse error response:', parseError);
                            alert(`Error saving sales detail for Product ID ${item.product_id}. Server response: ${errorText}`);
                        }
                        return;
                    }
            
                    const detailResult = await detailResponse.json();
                    console.log(`Sales detail ${i + 1} saved successfully:`, detailResult);
                }

                console.log('All data saved successfully, proceeding with print...');
        
                // Proceed with printing
                const inputs = document.querySelectorAll('#bill input');
                inputs.forEach(input => input.style.border = 'none');
                window.print();
                inputs.forEach(input => input.style.border = '1px solid var(--border-color)');

                } catch (error) {
                    console.error('Detailed error information:', error);
                    console.error('Error stack:', error.stack);
        
                    if (error.name === 'TypeError' && error.message.includes('fetch')) {
                        alert('Network error: Cannot connect to server. Please check if the server is running on http://localhost:8000');
                    } else {
                        alert(`Error saving data: ${error.message}\n\nCheck browser console for detailed error information.`);
                    }
                }
        }

        function resetBill() {
            if (confirm("Are you sure you want to start a new bill?")) {
                document.getElementById('bill').style.display = 'none';
                document.getElementById('customer-form').style.display = 'block';
                document.getElementById('newCustomerForm').style.display = 'none';
                document.getElementById('customerPhone').disabled = false;
                document.querySelectorAll('#customer-form input, #customer-form select').forEach(el => el.value = '');
                document.getElementById('billTableBody').innerHTML = '';
                generateBillNumber();
                setCurrentDateTime();
                addRow();
            }
        }

        async function validateProductId(input) {
            const productId = input.value.trim();
            if (productId) {
                try {
                    const response = await fetch(`http://localhost:8000/products/?product_id=${productId}`);
                    const products = await response.json();
                    if (products.length === 0) {
                        alert(`Product ID ${productId} does not exist.`);
                        input.value = '';
                    }
                } catch (error) {
                    console.error('Error validating product:', error);
                }
            }
        }