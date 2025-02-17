const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggleSidebar');

toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
});



const menuItems = document.querySelectorAll('.menu-item');
menuItems.forEach(item => {
    item.addEventListener('click', () => {
        menuItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
    });
});

const modal = document.getElementById('uploadModal');
const uploadBtn = document.getElementById('uploadBtn');
const fileInput = document.getElementById(('fileInput'));
const closeBtn = document.getElementsByClassName('close')[0];
const uploadBtnInModal = document.querySelector('.upload-btn');

uploadBtn.onClick = () => modal.style.displa = "block";
closeBtn.onClick = () => modal.style.display = "none"; 
window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};


fileInput.addEventListener('change', async (e) => {

    const file = e.target.files[0]; 
    if (file) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('https://momo-g9rq.onrender.com/upload', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                alert('File uploaded successfully!');
                modal.style.display = "none";
            } else {
                alert('Upload failed. Please try again');
            }
        } catch (error) {
            console.error("Error: ", error);
            alert('Upload failed. Please try again.');
        }
    }
});


// Loading transactions data
async function loadTransactions() {
    try {
        const response  = await fetch('https://momo-g9rq.onrender.com/transactions');
        const data = await response.json(); 
        console.log(data);
    } catch (error) {
        console.error('Error loading transactions: ', error);
    }
}

loadTransactions();


function loadComponent(name) {
    const contentDiv = document.querySelector('.dashboard-content');
    fetch(`${name}.html`)
        .then(response => response.text())
        .then(html => {
            contentDiv.innerHTML = html;
            // Execute any scripts in the loaded content
            contentDiv.querySelectorAll('script').forEach(script => {
                const newScript = document.createElement('script');
                Array.from(script.attributes).forEach(attr => {
                    newScript.setAttribute(attr.name, attr.value);
                });
                newScript.textContent = script.textContent;
                script.parentNode.replaceChild(newScript, script);
            });
        });
}


function setActiveMenuItem(clickedItem) {
    
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    
    clickedItem.classList.add('active');
}



document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
        setActiveMenuItem(item);
        
        const text = item.querySelector('span').textContent.toLowerCase();
        if (text === 'dashboard') {
            loadComponent('dashboard');
        } else if (text === 'incoming money') {
            loadComponent('incoming-money');
        } else if (text === 'bank deposits') {
            loadComponent('bank-deposits');
        } else if (text === 'airtime bill payments') {
            loadComponent('airtime-payments');
        } else if (text === 'cash power bill payments') {
            loadComponent('cash-power-payments');
        }
        else if (text === 'third party transactions') {
            loadComponent('third-party-transactions.html');
        }
        else if (text === 'withdrawals from agents') {
            loadComponent('withdrawal-from-agents');
        }
        else if (text === 'bank transfers') {
            loadComponent('banktransfer');
        }
        else if (text === 'internet voice bundles') {
            loadComponent('internet-voicebundles');
        }
       
    });
});


loadComponent('dashboard');
