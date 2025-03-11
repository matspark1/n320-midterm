import { jsPDF } from "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.0.0/jspdf.es.js";

class GeneratePDF {
  pdfDoc;
  position = { x: 10, y: 10 };
  pageCounter = 1;

  constructor(domRefId) {
    this.pdfDoc = new jsPDF();
    if (domRefId) {
      this.domRef = document.querySelector(`#${domRefId}`);
    }
  }

  downloadPDF(title) {
    this.pdfDoc.save(title);
  }

  getPDFURL() {
    return this.pdfDoc.output("bloburl");
  }

  addText(text, size = 12) {
    this.pdfDoc.setFontSize(size);
    this.pdfDoc.text(text, this.position.x, this.position.y);
    this.position.y += 6;
  }

  showPDF() {
    if (this.domRef) {
      this.domRef.src = this.getPDFURL();
    }
  }
  resetPDF() {
    this.position = { x: 10, y: 10 };
    for (let i = this.pageCounter; i > 0; i--) {
      this.pdfDoc.deletePage(i);
    }
    this.pageCounter = 1;
    this.pdfDoc.addPage();

    if (this.domRef) {
      this.domRef.src = this.getPDFURL;
    }
  }
}

const shoppingCartTable = document.querySelector("#shoppingcart");
const cart = [];

function addToCart(productName, price) {
  const priceValue = parseFloat(price);

  let existingItem = cart.find((item) => item.name === productName);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name: productName, quantity: 1, price: priceValue });
  }
  console.log(cart);

  updateCartUI();
}

function updateCartUI() {
  shoppingCartTable.innerHTML = `
    <tr>
      <th>Your Items</th>
      <th>Quantity</th>
      <th>Price</th>
    </tr>
  `;

  cart.forEach((item) => {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>$${(item.quantity * item.price).toFixed(2)}</td>
    `;
    shoppingCartTable.appendChild(newRow);
  });
}

document.querySelectorAll(".shop-box button").forEach((button) => {
  button.addEventListener("click", function () {
    const productInfo = this.parentElement;
    const productName = productInfo.querySelector("h3").innerText;
    const price = productInfo.querySelector("p").innerText.replace("$", "");
    addToCart(productName, price);
  });
});

const myPDF = new GeneratePDF("pdf-preview");
const saveNameInput = document.querySelector("#saveName");
const saveEmailInput = document.querySelector("#saveEmail");
const previewBtn = document.querySelector("#previewBtn");
const pdfBtns = document.querySelector("#pdf-download");

previewBtn.addEventListener("click", () => {
  const saveName = saveNameInput.value;
  const saveEmail = saveEmailInput.value;

  const date = new Date();

  const formattedDate = date.toLocaleDateString();
  const formattedTime = date.toLocaleTimeString();

  if (!saveName || !saveEmail) {
    alert("Please enter your name and email.");
    return;
  }

  if (cart.length === 0) {
    alert("There are no items in your cart. Invoice could not be made.");
    return;
  }

  myPDF.resetPDF();

  pdfBtns.innerHTML = `      <button id="downloadBtn">
        <i class="fa-solid fa-download"></i> Download Your Invoice
      </button>`;

  const downloadBtn = document.querySelector("#downloadBtn");

  const randomNum = Math.floor(Math.random() * 100000000);

  myPDF.addText(`Invoice #${randomNum}`, 18);
  myPDF.addText(`Date: ${formattedDate} ${formattedTime}`);
  myPDF.addText("________________________________");
  myPDF.addText(" ");
  myPDF.addText(`Name: ${saveName}`);
  myPDF.addText(`Email: ${saveEmail}`);
  myPDF.addText("________________________________");
  myPDF.addText(" ");
  myPDF.addText("Items:", 14);

  let subtotal = 0;

  cart.forEach((item) => {
    const itemTotal = item.quantity * item.price;
    myPDF.addText(`${item.name} - ${item.quantity} - $${itemTotal.toFixed(2)}`);
    subtotal += itemTotal;
  });

  const tax = subtotal * 0.07;
  const total = subtotal + tax;

  myPDF.addText("________________________________");
  myPDF.addText(" ");
  myPDF.addText(`Subtotal: $${subtotal.toFixed(2)}`);
  myPDF.addText(" ");
  myPDF.addText(`Tax: $${tax.toFixed(2)}`);
  myPDF.addText(`Total: $${total.toFixed(2)}`, 16);

  myPDF.showPDF();

  downloadBtn.addEventListener("click", () => {
    myPDF.downloadPDF(`${saveName}-Invoice.pdf`);
  });
});
