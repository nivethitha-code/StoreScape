// DOM Elements
            const productTableBody = document.querySelector('#productTable tbody');
            const supplierTableBody = document.querySelector('#supplierTable tbody');
            const warehouseTableBody = document.querySelector('#warehouseTable tbody');
            const tabs = document.querySelectorAll('.tab');
            const tabContents = document.querySelectorAll('.tab-content');
            const modals = document.querySelectorAll('.modal');
            const closeButtons = document.querySelectorAll('.close-btn');

            // Helper function to switch tabs
            function switchTab(tabId) {
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));

                const tab = document.querySelector(`.tab[data-tab="${tabId}"]`);
                const content = document.getElementById(`${tabId}-tab`);
                if (tab && content) {
                    tab.classList.add('active');
                    content.classList.add('active');
                    loadTabData(tabId);
                }
            }

            // Load data for the active tab
            async function loadTabData(tabId) {
                switch (tabId) {
                    case 'products': await loadProducts(); break;
                    case 'suppliers': await loadSuppliers(); break;
                    case 'warehouses': await loadWarehouses(); break;
                }
            }

            // Fetch and display products
            async function loadProducts() {
                try {
                    const response = await fetch('/products/');
                    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                    const products = await response.json();
                    displayProducts(products);
                } catch (error) {
                    console.error('Error fetching products:', error);
                    document.getElementById('productError').textContent = 'Failed to load products: ' + error.message;
                    document.getElementById('productError').style.display = 'block';
                }
            }

            function displayProducts(products) {
                productTableBody.innerHTML = ''; // Clear existing rows
                products.forEach(product => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                <td>${product.product_id}</td>
                <td>${product.product_name}</td>
                <td>${product.warehouse_id}</td>
                <td>${product.rate_per_unit}</td>
                <td>${product.stock}</td>
                <td>
                    <button class="btn edit-btn" onclick="editProduct('${product.product_id}')">Edit</button>
                    <button class="btn delete-btn" onclick="deleteProduct('${product.product_id}')">Delete</button>
                </td>
            `;
                    productTableBody.appendChild(row);
                });
            }

            // Fetch and display suppliers
            async function loadSuppliers() {
                try {
                    const response = await fetch('/suppliers/');
                    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                    const suppliers = await response.json();
                    displaySuppliers(suppliers);
                } catch (error) {
                    console.error('Error fetching suppliers:', error);
                    document.getElementById('supplierError').textContent = 'Failed to load suppliers: ' + error.message;
                    document.getElementById('supplierError').style.display = 'block';
                }
            }

            function displaySuppliers(suppliers) {
                supplierTableBody.innerHTML = ''; // Clear existing rows
                suppliers.forEach(supplier => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                <td>${supplier.supplier_id}</td>
                <td>${supplier.supplier_name}</td>
                <td>${supplier.contact}</td>
                <td>${supplier.address}</td>
                <td>
                    <button class="btn edit-btn" onclick="editSupplier('${supplier.supplier_id}')">Edit</button>
                    <button class="btn delete-btn" onclick="deleteSupplier('${supplier.supplier_id}')">Delete</button>
                </td>
            `;
                    supplierTableBody.appendChild(row);
                });
            }

            // Fetch and display warehouses
            async function loadWarehouses() {
                try {
                    const response = await fetch('/warehouses/');
                    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                    const warehouses = await response.json();
                    displayWarehouses(warehouses);
                } catch (error) {
                    console.error('Error fetching warehouses:', error);
                    document.getElementById('warehouseError').textContent = 'Failed to load warehouses: ' + error.message;
                    document.getElementById('warehouseError').style.display = 'block';
                }
            }

            function displayWarehouses(warehouses) {
                warehouseTableBody.innerHTML = ''; // Clear existing rows
                warehouses.forEach(warehouse => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                <td>${warehouse.warehouse_id}</td>
                <td>${warehouse.location}</td>
                <td>
                    <button class="btn edit-btn" onclick="editWarehouse('${warehouse.warehouse_id}')">Edit</button>
                    <button class="btn delete-btn" onclick="deleteWarehouse('${warehouse.warehouse_id}')">Delete</button>
                </td>
            `;
                    warehouseTableBody.appendChild(row);
                });
            }

            // Tab switching on click
            tabs.forEach(tab => {
                tab.addEventListener('click', function () {
                    const tabId = this.getAttribute('data-tab');
                    switchTab(tabId);
                    history.pushState({}, '', `/${tabId}/`);
                });
            });

            // Modal handling
            closeButtons.forEach(button => {
                button.addEventListener('click', () => {
                    modals.forEach(modal => modal.style.display = 'none');
                });
            });

            modals.forEach(modal => {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) modal.style.display = 'none';
                });
            });

            // Event Listeners for Add Buttons
            document.getElementById('addProductBtn').addEventListener('click', () => {
                document.getElementById('productModalTitle').textContent = 'Add Product';
                document.getElementById('productForm').reset();
                document.getElementById('productId').value = '';
                document.getElementById('productId').readOnly = false; // Allow editing ID for new products
                document.getElementById('productModal').style.display = 'flex';
            });

            document.getElementById('addSupplierBtn').addEventListener('click', () => {
                document.getElementById('supplierModalTitle').textContent = 'Add Supplier';
                document.getElementById('supplierForm').reset();
                document.getElementById('supplierId').value = '';
                document.getElementById('supplierId').readOnly = false;
                document.getElementById('supplierModal').style.display = 'flex';
            });

            document.getElementById('addWarehouseBtn').addEventListener('click', () => {
                document.getElementById('warehouseModalTitle').textContent = 'Add Warehouse';
                document.getElementById('warehouseForm').reset();
                document.getElementById('warehouseId').value = '';
                document.getElementById('warehouseId').readOnly = false;
                document.getElementById('warehouseModal').style.display = 'flex';
            });

            document.getElementById('cancelProductBtn').addEventListener('click', () => {
                document.getElementById('productModal').style.display = 'none';
            });

            document.getElementById('cancelSupplierBtn').addEventListener('click', () => {
                document.getElementById('supplierModal').style.display = 'none';
            });

            document.getElementById('cancelWarehouseBtn').addEventListener('click', () => {
                document.getElementById('warehouseModal').style.display = 'none';
            });

            // Form submission for products
            document.getElementById('productForm').addEventListener('submit', async function (event) {
                event.preventDefault();
                const formData = new FormData(this);
                const productId = document.getElementById('productId').value;
                const isEditing = document.getElementById('productId').readOnly; // Better check for edit mode
                const method = isEditing ? 'PUT' : 'POST';
                const url = isEditing ? `/products/${productId}` : '/products/';

                try {
                    const response = await fetch(url, {
                        method: method,
                        body: formData, // Send FormData directly
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(errorText);
                    }
                    alert(isEditing ? 'Product updated successfully!' : 'Product added successfully!');
                    document.getElementById('productModal').style.display = 'none';
                    await loadProducts(); // Refresh the product table
                } catch (error) {
                    alert(`Error ${isEditing ? 'updating' : 'adding'} product: ${error.message}`);
                    console.error('Error details:', error);
                }
            });

            // Form submission for suppliers
            document.getElementById('supplierForm').addEventListener('submit', async function (event) {
                event.preventDefault();
                const formData = new FormData(this);
                const supplierId = document.getElementById('supplierId').value;
                const isEditing = document.getElementById('supplierId').readOnly;
                const method = isEditing ? 'PUT' : 'POST';
                const url = isEditing ? `/suppliers/${supplierId}` : '/suppliers/';

                try {
                    const response = await fetch(url, {
                        method: method,
                        body: formData,
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(errorText);
                    }
                    alert(isEditing ? 'Supplier updated successfully!' : 'Supplier added successfully!');
                    document.getElementById('supplierModal').style.display = 'none';
                    await loadSuppliers();
                } catch (error) {
                    alert(`Error ${isEditing ? 'updating' : 'adding'} supplier: ${error.message}`);
                    console.error('Error details:', error);
                }
            });

            // Form submission for warehouses
            document.getElementById('warehouseForm').addEventListener('submit', async function (event) {
                event.preventDefault();
                const formData = new FormData(this);
                const warehouseId = document.getElementById('warehouseId').value;
                const isEditing = document.getElementById('warehouseId').readOnly;
                const method = isEditing ? 'PUT' : 'POST';
                const url = isEditing ? `/warehouses/${warehouseId}` : '/warehouses/';

                try {
                    const response = await fetch(url, {
                        method: method,
                        body: formData,
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(errorText);
                    }
                    alert(isEditing ? 'Warehouse updated successfully!' : 'Warehouse added successfully!');
                    document.getElementById('warehouseModal').style.display = 'none';
                    await loadWarehouses();
                } catch (error) {
                    alert(`Error ${isEditing ? 'updating' : 'adding'} warehouse: ${error.message}`);
                    console.error('Error details:', error);
                }
            });

            // Edit and Delete functions
            window.editProduct = async function (productId) {
                try {
                    const response = await fetch(`/products/${productId}`);
                    if (!response.ok) throw new Error(await response.text());
                    const product = await response.json();
                    document.getElementById('productModalTitle').textContent = 'Edit Product';
                    document.getElementById('productId').value = product.product_id;
                    document.getElementById('productId').readOnly = true; // Prevent editing ID
                    document.getElementById('productName').value = product.product_name;
                    document.getElementById('warehouse_id').value = product.warehouse_id;
                    document.getElementById('productPrice').value = product.rate_per_unit;
                    document.getElementById('productStock').value = product.stock;
                    document.getElementById('productModal').style.display = 'flex';
                } catch (error) {
                    alert('Error loading product: ' + error.message);
                }
            };

            window.deleteProduct = async function (productId) {
                if (confirm('Are you sure you want to delete this product?')) {
                    try {
                        const response = await fetch(`/products/${productId}`, { method: 'DELETE' });
                        if (!response.ok) throw new Error(await response.text());
                        await loadProducts();
                    } catch (error) {
                        alert('Error deleting product: ' + error.message);
                    }
                }
            };

            window.editSupplier = async function (supplierId) {
                try {
                    const response = await fetch(`/suppliers/${supplierId}`);
                    if (!response.ok) throw new Error(await response.text());
                    const supplier = await response.json();
                    document.getElementById('supplierModalTitle').textContent = 'Edit Supplier';
                    document.getElementById('supplierId').value = supplier.supplier_id;
                    document.getElementById('supplierId').readOnly = true;
                    document.getElementById('supplierName').value = supplier.supplier_name;
                    document.getElementById('supplierContact').value = supplier.contact;
                    document.getElementById('supplierAddress').value = supplier.address;
                    document.getElementById('supplierModal').style.display = 'flex';
                } catch (error) {
                    alert('Error loading supplier: ' + error.message);
                }
            };

            window.deleteSupplier = async function (supplierId) {
                if (confirm('Are you sure you want to delete this supplier?')) {
                    try {
                        const response = await fetch(`/suppliers/${supplierId}`, { method: 'DELETE' });
                        if (!response.ok) throw new Error(await response.text());
                        await loadSuppliers();
                    } catch (error) {
                        alert('Error deleting supplier: ' + error.message);
                    }
                }
            };


            window.editWarehouse = async function (warehouseId) {
                try {
                    const response = await fetch(`/warehouses/${warehouseId}`);
                    if (!response.ok) throw new Error(await response.text());
                    const warehouse = await response.json();
                    document.getElementById('warehouseModalTitle').textContent = 'Edit Warehouse';
                    document.getElementById('warehouseId').value = warehouse.warehouse_id;
                    document.getElementById('warehouseId').readOnly = true;
                    document.getElementById('warehouseLocation').value = warehouse.location;
                    document.getElementById('warehouseModal').style.display = 'flex';
                } catch (error) {
                    alert('Error loading warehouse: ' + error.message);
                }
            };

            window.deleteWarehouse = async function (warehouseId) {
                if (confirm('Are you sure you want to delete this warehouse?')) {
                    try {
                        const response = await fetch(`/warehouses/${warehouseId}`, { method: 'DELETE' });
                        if (!response.ok) throw new Error(await response.text());
                        await loadWarehouses();
                    } catch (error) {
                        alert('Error deleting warehouse: ' + error.message);
                    }
                }
            };

            document.getElementById('productSearch').addEventListener('input', function () {
                const searchTerm = this.value.toLowerCase();
                const rows = productTableBody.querySelectorAll('tr');
                rows.forEach(row => {
                    const name = row.cells[1].textContent.toLowerCase();
                    row.style.display = name.includes(searchTerm) ? '' : 'none';
                });
            });

            document.getElementById('supplierSearch').addEventListener('input', function () {
                const searchTerm = this.value.toLowerCase();
                const rows = supplierTableBody.querySelectorAll('tr');
                rows.forEach(row => {
                    const name = row.cells[1].textContent.toLowerCase();
                    row.style.display = name.includes(searchTerm) ? '' : 'none';
                });
            });

            document.getElementById('warehouseSearch').addEventListener('input', function () {
                const searchTerm = this.value.toLowerCase();
                const rows = warehouseTableBody.querySelectorAll('tr');
                rows.forEach(row => {
                    const name = row.cells[1].textContent.toLowerCase();
                    row.style.display = name.includes(searchTerm) ? '' : 'none';
                });
            });

            // Initialize on page load
            document.addEventListener('DOMContentLoaded', async () => {
                const currentPath = window.location.pathname;
                if (currentPath === '/suppliers/') {
                    switchTab('suppliers');
                } else if (currentPath === '/warehouses/') {
                    switchTab('warehouses');
                }
                else {
                    switchTab('products');
                }
                await loadProducts();
                await loadSuppliers();
                await loadWarehouses();
            });

            document.getElementById('logoutBtn').addEventListener('click', () => {
                window.location.href = '/';
            });