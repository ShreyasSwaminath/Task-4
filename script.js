// Theme toggle logic
const toggleBtn = document.getElementById('themeToggle');
toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        toggleBtn.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
        localStorage.setItem('theme', 'dark');
    } else {
        toggleBtn.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
        localStorage.setItem('theme', 'light');
    }
});

// Check for saved theme preference
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    toggleBtn.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
}

// To-Do List functionality
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();
    
    if (taskText) {
        tasks.push(taskText);
        taskInput.value = '';
        updateTaskList();
        saveTasks();
    }
}

function updateTaskList() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${task}</span>
            <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
        `;
        taskList.appendChild(li);
    });
}

function deleteTask(index) {
    tasks.splice(index, 1);
    updateTaskList();
    saveTasks();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Products data and functionality
const products = [
    { 
        id: 1, 
        name: "Grand Theft Auto IV", 
        category: "games", 
        price: 29.99, 
        rating: 4.7,
        image: "images/Screenshot 2025-09-06 232113.png"  
    },
    { 
        id: 2, 
        name: "Grand Theft Auto V", 
        category: "games", 
        price: 39.99, 
        rating: 4.9,
        image: "images/Screenshot 2025-09-06 231953.png"
    },
    { 
        id: 3, 
        name: "Grand Theft Auto VI", 
        category: "games", 
        price: 69.99, 
        rating: 4.8,
        image: "images/Screenshot 2025-09-06 231756.png"
    },
    { 
        id: 4, 
        name: "Xbox Series X", 
        category: "consoles", 
        price: 499.99, 
        rating: 4.8,
        image: "images/Screenshot 2025-09-06 233847.png"
    },
    { 
        id: 5, 
        name: "Xbox Series S", 
        category: "consoles", 
        price: 299.99, 
        rating: 4.6,
        image: "images/Screenshot 2025-09-06 230646.png"
    },
    { 
        id: 6, 
        name: "PlayStation 5", 
        category: "consoles", 
        price: 499.99, 
        rating: 4.9,
        image: "images/Screenshot 2025-09-06 230928.png"
    }
];

// Function to generate star rating HTML
function generateStarRating(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
        stars += '★';
    }
    
    if (hasHalfStar) {
        stars += '½';
    }
    
    // Fill remaining stars with empty stars
    const remaining = 5 - Math.ceil(rating);
    for (let i = 0; i < remaining; i++) {
        stars += '☆';
    }
    
    return stars;
}

function displayProducts(productsToShow) {
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = '';

    if (productsToShow.length === 0) {
        productGrid.innerHTML = '<div class="no-products">No products match your filters</div>';
        return;
    }

    productsToShow.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';

        const imageContent = product.image && product.image !== "" 
            ? `<img src="${product.image}" alt="${product.name}" style="width:100%;height:100%;object-fit:cover;" onerror="this.parentNode.innerHTML='${product.name}'">`
            : product.name;

        productCard.innerHTML = `
            <div class="product-img">${imageContent}</div>
            <div class="product-details">
                <h3>${product.name}</h3>
                <div class="product-category">Category: ${product.category}</div>
                <div class="product-price">Price: $${product.price.toFixed(2)}</div>
                <div class="product-rating">Rating: ${product.rating}/5</div>
            </div>
        `;

        productGrid.appendChild(productCard);
    });
}

function updateProductDisplay() {
    let filtered = [...products];
    const category = document.getElementById('categoryFilter').value;
    const sort = document.getElementById('sortOption').value;

    // Filter
    if (category !== 'all') {
        filtered = filtered.filter(p => p.category === category);
    }

    // Sort
    if (sort === 'price') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
    }

    displayProducts(filtered);
}

document.addEventListener('DOMContentLoaded', function() {
    updateTaskList();
    displayProducts(products);

    // Add event listeners for filter and sort
    document.getElementById('categoryFilter').addEventListener('change', updateProductDisplay);
    document.getElementById('sortOption').addEventListener('change', updateProductDisplay);

    // ...other event listeners...
});

function filterProducts() {
    const categoryValue = document.getElementById('categoryFilter').value;
    const priceValue = document.getElementById('priceFilter').value;
    const ratingValue = document.getElementById('ratingFilter').value;
    
    const filteredProducts = products.filter(product => {
        // Category filter
        if (categoryValue !== 'all' && product.category !== categoryValue) {
            return false;
        }
        
        // Price filter
        if (priceValue !== 'all') {
            if (priceValue === '0-50' && product.price > 50) return false;
            if (priceValue === '50-100' && (product.price <= 50 || product.price > 100)) return false;
            if (priceValue === '100-300' && (product.price <= 100 || product.price > 300)) return false;
            if (priceValue === '300+' && product.price <= 300) return false;
        }
        
        // Rating filter
        if (ratingValue !== 'all') {
            const minRating = parseFloat(ratingValue);
            if (product.rating < minRating) return false;
        }
        
        return true;
    });
    
    displayProducts(filteredProducts);
}

function sortProducts() {
    const sortOption = document.getElementById('sortOption').value;
    let sortedProducts = [...products];
    
    if (sortOption === 'price') {
        sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'rating') {
        sortedProducts.sort((a, b) => b.rating - a.rating);
    }
    
    displayProducts(sortedProducts);
}

// Contact form handling
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your message! I will get back to you soon.');
    this.reset();
});

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    updateTaskList();
    displayProducts(products);
    
    // Add event listeners
    document.getElementById('addTaskBtn').addEventListener('click', addTask);
    document.getElementById('taskInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    // Add event listeners for the filters
    document.getElementById('categoryFilter').addEventListener('change', filterProducts);
    document.getElementById('priceFilter').addEventListener('change', filterProducts);
    document.getElementById('ratingFilter').addEventListener('change', filterProducts);
    document.getElementById('sortOption').addEventListener('change', sortProducts);
});