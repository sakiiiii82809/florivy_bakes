const categoryCheckboxes = document.querySelectorAll(
    '.category-nav input[name="category"]'
);

const productSections = document.querySelectorAll(".product-section");

categoryCheckboxes.forEach(checkbox => {
    checkbox.addEventListener("change", () => {

        const allCheckbox = document.getElementById("all");

        if (checkbox.id === "all" && checkbox.checked) {
            categoryCheckboxes.forEach(cb => {
                if (cb.id !== "all") {
                    cb.checked = false;
                }
            });
        }

        if (checkbox.id !== "all" && checkbox.checked) {
            allCheckbox.checked = false;
        }

        const selectedCategories = [...categoryCheckboxes]
            .filter(cb => cb.checked && cb.id !== "all")
            .map(cb => cb.value);

        if (selectedCategories.length === 0) {
            allCheckbox.checked = true;
        }

        productSections.forEach(section => {

            const products = section.querySelectorAll(".product-card");
            let visibleProducts = 0;

            products.forEach(product => {

                if (allCheckbox.checked) {
                    product.style.display = "";
                    visibleProducts++;
                    return;
                }

                const productCategories =
                    product.dataset.category.split(" ");

                const selectedTypes = selectedCategories.filter(category =>
                    category === "cookies" || category === "crinkles"
                );

                const wantsBestSeller =
                    selectedCategories.includes("bestseller");

                const matchesType =
                    selectedTypes.length === 0 ||
                    selectedTypes.some(category =>
                        productCategories.includes(category)
                    );

                const matchesBestSeller =
                    !wantsBestSeller ||
                    productCategories.includes("bestseller");

                const matches =
                    matchesType && matchesBestSeller;

                if (matches) {
                    product.style.display = "";
                    visibleProducts++;
                } else {
                    product.style.display = "none";
                }
            });

            section.style.display =
                visibleProducts > 0 ? "" : "none";
        });
    });
});