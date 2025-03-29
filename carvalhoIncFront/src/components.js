function make_product(product, search_term) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("product");
    wrapper.dataset.searchTerm = search_term.replace(" ", "-");
    const div = document.createElement("div");
    const title = document.createElement("h2");
    const img = document.createElement("img");
    const reviews = document.createElement("p");
    const rating = document.createElement("p");

    rating.textContent = "Ratings: " + product.rating;
    reviews.textContent = "Reviews: " + product.reviews;

    img.src = product.image;

    title.textContent = product.title;

    div.append(title, rating, reviews);

    wrapper.append(img, div);

    return wrapper;
}

function show_popover(msg = "Something went wrong :c", timeout = -1) {
    const popover = document.querySelector("div#popover");

    popover.textContent = msg;
    popover.showPopover();
    if (timeout > 0) {
        setTimeout(() => {
            popover.hidePopover();
        }, timeout);
    }
}

function make_search_helper(query) {
    const div = document.createElement("div");
    div.dataset.searchTerm = query.replace(" ", "-");

    const p = document.createElement("p");
    p.textContent = query;
    div.append(p);

    const span = document.createElement("span");
    span.textContent = "X";
    div.append(span);

    return div;
}
function make_pre_tag(data, term) {
    const pre = document.createElement("pre");
    pre.dataset.searchTerm = term.replace(" ", "-");
    pre.textContent = JSON.stringify(data, null, 4);
    document.querySelector("main#scrape-results").append(pre);
    console.log(JSON.stringify(data, null, 4));
}

export { make_product, show_popover, make_search_helper, make_pre_tag };
