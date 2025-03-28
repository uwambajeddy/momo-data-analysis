const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggleSidebar");

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
});

const menuItems = document.querySelectorAll(".menu-item");
menuItems.forEach(item => {
  item.addEventListener("click", () => {
    menuItems.forEach(i => i.classList.remove("active"));
    item.classList.add("active");
  });
});

const modal = document.getElementById("uploadModal");
const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("fileInput");
const closeBtn = document.getElementsByClassName("close")[0];
const uploadBtnInModal = document.querySelector(".upload-btn");

uploadBtn.addEventListener("click", () => {
  modal.style.display = "block";
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

window.onclick = event => {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

const searchInput = document.querySelector(".search-input");
const searchIcon = document.querySelector(".search-icon");

async function performSearch() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  if (!searchTerm) return;

  try {
    const response = await fetch("https://momo-g9rq.onrender.com/transactions");
    const transactions = await response.json();

    const filteredTransactions = transactions.filter(t => {
      const amountStr = t.amount ? t.amount.toString() : "";
      return (
        amountStr.includes(searchTerm) ||
        (t.transaction_id &&
          t.transaction_id.toLowerCase().includes(searchTerm)) ||
        (t.sender && t.sender.toLowerCase().includes(searchTerm))
      );
    });

    displaySearchResults(filteredTransactions);
  } catch (error) {
    console.error("Error performing search:", error);
  }
}

searchIcon.addEventListener("click", performSearch);

searchInput.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    performSearch();
  }
});

function displaySearchResults(transactions) {
  const contentDiv = document.querySelector(".dashboard-content");

  contentDiv.innerHTML = `<h2>Search Results</h2>`;

  if (transactions.length === 0) {
    contentDiv.innerHTML += `<p>No transactions found matching your search.</p>`;
    return;
  }

  let tableHTML = `
    <div class="transactions-table">
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Sender</th>
                    <th>Transaction ID</th>
                </tr>
            </thead>
            <tbody>
    `;

  transactions.forEach(t => {
    tableHTML += `
            <tr>
                <td>${new Date(t.transaction_date).toLocaleDateString()}</td>
                <td class="amount">RWF ${t.amount.toLocaleString()}</td>
                <td>${t.sender || ""}</td>
                <td>${t.transaction_id || ""}</td>
            </tr>
        `;
  });

  tableHTML += `
            </tbody>
        </table>
    </div>
    `;

  contentDiv.innerHTML += tableHTML;
}

fileInput.addEventListener("change", async e => {
  const file = e.target.files[0];
  if (file) {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("https://momo-g9rq.onrender.com/upload", {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        alert("File uploaded successfully!");
        modal.style.display = "none";
      } else {
        alert("Upload failed. Please try again");
      }
    } catch (error) {
      console.error("Error: ", error);
      alert("Upload failed. Please try again.");
    }
  }
});

async function loadTransactions() {
  try {
    const response = await fetch("https://momo-g9rq.onrender.com/transactions");
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error loading transactions: ", error);
  }
}

loadTransactions();

function loadComponent(name) {
  const contentDiv = document.querySelector(".dashboard-content");
  fetch(`${name}.html`).then(response => response.text()).then(html => {
    contentDiv.innerHTML = html;

    contentDiv.querySelectorAll("script").forEach(script => {
      const newScript = document.createElement("script");
      Array.from(script.attributes).forEach(attr => {
        newScript.setAttribute(attr.name, attr.value);
      });
      newScript.textContent = script.textContent;
      script.parentNode.replaceChild(newScript, script);
    });
  });
}

function setActiveMenuItem(clickedItem) {
  document.querySelectorAll(".menu-item").forEach(item => {
    item.classList.remove("active");
  });

  clickedItem.classList.add("active");
}

document.querySelectorAll(".menu-item").forEach(item => {
  item.addEventListener("click", () => {
    setActiveMenuItem(item);

    const text = item.querySelector("span").textContent.toLowerCase();
    if (text === "dashboard") {
      loadComponent("dashboard");
    } else if (text === "incoming money") {
      loadComponent("incoming-money");
    } else if (text === "bank deposits") {
      loadComponent("bank-deposits");
    } else if (text === "airtime bill payments") {
      loadComponent("airtime-payments");
    } else if (text === "cash power bill payments") {
      loadComponent("cash-power-payments");
    } else if (text === "third party transactions") {
      loadComponent("third-party-transactions");
    } else if (text === "withdrawals from agents") {
      loadComponent("withdrawal-from-agents");
    } else if (text === "bank transfers") {
      loadComponent("banktransfer");
    } else if (text === "internet & voice bundles") {
      loadComponent("internet-voicebundles");
    } else if (text === "payments to code holders") {
      loadComponent("payments-to-code-holders");
    } else if (text === "transfers to mobile numbers") {
      loadComponent("transfers-to-mobile-numbers");
    }
  });
});

document.addEventListener("DOMContentLoaded", function() {
  const fileInput = document.getElementById("fileInput");
  const uploadButton = document.getElementById("uploadFileButton");
  const loadingIndicator = document.getElementById("loadingIndicator");
  const uploadMessage = document.getElementById("uploadMessage");

  uploadButton.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", async function(event) {
    const file = event.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    loadingIndicator.style.display = "block";
    uploadMessage.innerHTML = "";

    try {
      const response = await fetch("https://momo-g9rq.onrender.com/upload", {
        method: "POST",
        body: formData
      });

      const result = await response.json();
      loadingIndicator.style.display = "none";

      if (response.ok) {
        uploadMessage.innerHTML = `<p style="color: green;">✅ File uploaded successfully! Transactions processed: ${result.message}</p>`;
      } else {
        uploadMessage.innerHTML = `<p style="color: red;">❌ Upload failed: ${result.error}</p>`;
      }
    } catch (error) {
      console.error("Upload error:", error);
      uploadMessage.innerHTML = `<p style="color: red;">❌ An error occurred while uploading.</p>`;
      loadingIndicator.style.display = "none";
    }
  });
});

loadComponent("dashboard");
