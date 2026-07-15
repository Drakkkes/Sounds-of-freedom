document.addEventListener("DOMContentLoaded", function () {
  // Перелистывающийся слайдер
  const slides = document.querySelectorAll('input[name="slider"]');
  let current = 0;
  const total = slides.length;
  const intervalTime = 10000; 
  setInterval(() => {
    slides[current].checked = false;
    current = (current + 1) % total;
    slides[current].checked = true;
  }, intervalTime);

  
  // Блок "Цены на билеты"
  const modal = document.getElementById("modal");
  const addReviewBtn = document.getElementById("addReviewBtn");
  const closeBtn = document.querySelector(".close");
  const reviewForm = document.getElementById("reviewForm");
  const cancelBtn = document.getElementById("cancelBtn");
  const errorMessage = document.getElementById("errorMessage");
  let cart = [];
  const cartListEl = document.getElementById("cart-list");
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const ticketName = button.getAttribute("data-name");
      const ticketPrice = parseInt(button.getAttribute("data-price"));
      let existingTicket = cart.find((item) => item.name === ticketName);
      if (existingTicket) {
        existingTicket.quantity++;
      } else {
        cart.push({ name: ticketName, price: ticketPrice, quantity: 1 });
      }
      updateCartList();
    });
  });
  function updateCartList() {
    cartListEl.innerHTML = "";
    if (cart.length === 0) {
      const emptyMessage = document.createElement("p");
      emptyMessage.className = "fw-bold";
      emptyMessage.textContent = "Корзина пуста";
      cartListEl.appendChild(emptyMessage);
  
      paymentBtn.style.display = "none"; 
      return; 
    }
    paymentBtn.style.display = "inline-block";
    cart.forEach((ticket, index) => {
      const ticketEl = document.createElement("div");
      ticketEl.innerHTML = `
              <h6>${ticket.name}</h6>
              <p>Цена за билет: ${ticket.price} ₽</p>
              <div class="d-flex align-items-center mb-3">
                  <button class="btn btn-outline-secondary decrement" data-index="${index}">-</button>
                  <span class="mx-3">${ticket.quantity}</span>
                  <button class="btn btn-outline-secondary increment" data-index="${index}">+</button>
              </div>
              <p class="fw-bold">Итог: ${ticket.price * ticket.quantity} ₽</p>
          `;
  
      cartListEl.appendChild(ticketEl);
      ticketEl.querySelector(".increment").addEventListener("click", () => {
        cart[index].quantity++;
        updateCartList();
      });
  
      ticketEl.querySelector(".decrement").addEventListener("click", () => {
        if (cart[index].quantity > 1) {
          cart[index].quantity--;
          updateCartList();
        } else {
          cart.splice(index, 1);
          updateCartList();
        }
      });
    });
    const totalPrice = cart.reduce(
      (sum, ticket) => sum + ticket.price * ticket.quantity,
      0
    );
    const totalPriceEl = document.createElement("p");
    totalPriceEl.className = "fw-bold";
    totalPriceEl.textContent = `Общая стоимость: ${totalPrice} ₽`;
    cartListEl.appendChild(totalPriceEl);
  }
  const paymentBtn = document.querySelector("button.btn-success.mt-3");
  paymentBtn.addEventListener("click", () => {
    const offcanvas = document.querySelector("#offcanvasCart");
    const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvas);
    bsOffcanvas.hide();
    cart = [];
    updateCartList();
    alert("Спасибо за покупку! Ваша оплата успешно обработана.");
  });

// Блок "Отзывы"
  renderReviews(initialReviews);
});
    const reviewsContainer = document.getElementById('reviews-container');
    const addReviewBtn = document.getElementById('add-review');
    const modal = document.getElementById('modal');
    const modalClose = document.getElementById('modalClose');
    const reviewForm = document.getElementById('reviewForm');
    const submitBtn = document.getElementById('submitBtn');

    function createDeleteButton() {
      const btn = document.createElement('button');
      btn.className = 'delete-btn';
      btn.title = 'Удалить отзыв';
      btn.innerHTML = '&times;';
      btn.addEventListener('click', (e) => {
        const review = e.target.closest('.review');
        if (review) {
          if (confirm('Вы точно хотите удалить этот отзыв?')) {
            review.remove();
          }
        }
      });
      return btn;
    }

    addReviewBtn.addEventListener('click', () => {
      reviewForm.reset();
      submitBtn.disabled = true;
      modal.classList.add('active');
    });

    modalClose.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });

    function validateForm() {
      const name = reviewForm.name.value.trim();
      const description = reviewForm.description.value.trim();
      const privacyChecked = reviewForm.privacy.checked;

      const isNameValid = name.length >= 2;
      const isDescriptionValid = description.length >= 5;

      submitBtn.disabled = !(isNameValid && isDescriptionValid && privacyChecked);
    }

    reviewForm.addEventListener('input', validateForm);
    reviewForm.privacy.addEventListener('change', validateForm);

    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = reviewForm.name.value.trim();
      const description = reviewForm.description.value.trim();
      const fileInput = reviewForm.photo;
      const file = fileInput.files[0];

      function addReview(photoSrc) {
        const review = document.createElement('div');
        review.className = 'review';

        const deleteBtn = createDeleteButton();
        review.appendChild(deleteBtn);

        const img = document.createElement('img');
        img.alt = `Фото пользователя ${name}`;
        img.src = photoSrc || 'https://via.placeholder.com/100?text=Фото';

        const nameDiv = document.createElement('div');
        nameDiv.className = 'name';
        nameDiv.textContent = name;

        const descDiv = document.createElement('div');
        descDiv.className = 'description';
        descDiv.textContent = description;

        review.appendChild(img);
        review.appendChild(nameDiv);
        review.appendChild(descDiv);

        reviewsContainer.appendChild(review);
      }

      if (file) {
        if (file.size > 2 * 1024 * 1024) {
          alert('Размер фото не должен превышать 2 Мб.');
          return;
        }
        if (!file.type.startsWith('image/')) {
          alert('Пожалуйста, загрузите изображение в формате jpg, png или gif.');
          return;
        }
        const reader = new FileReader();
        reader.onload = function(event) {
          addReview(event.target.result);
          modal.classList.remove('active');
        };
        reader.readAsDataURL(file);
      } else {
        addReview(null);
        modal.classList.remove('active');
      }
    });

    document.querySelectorAll('.review .delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const review = e.target.closest('.review');
        if (review) {
          if (confirm('Вы точно хотите удалить этот отзыв?')) {
            review.remove();
          }
        }
      });
    });
