const API_KEY = `a0bb8dfd340249d9984b9ea521556358`;
let newsList = [];
const menus = document.querySelectorAll(".menus button");

let url = new URL(`https://newsapi.org/v2/top-headlines?&apiKey=${API_KEY}`);

let totalResults = 0

let page = 1 
const pageSize = 10 
const groupSize = 5


// 뉴스 API 호출 함수
const fetchNews = async () => {
    try {
        url.searchParams.set("page", page);
        url.searchParams.set("pageSize", pageSize)

        const response = await fetch(url);

        const data = await response.json();
        if (response.status === 200) {
            if (data.articles.length === 0) {
                throw new Error("No result for this search")
            }
            newsList = data.articles
            totalResults = data.totalResults
            render()
            paginationRender()
        } else {
            throw new Error(data.message)
        }
    } catch (error) {

        errorRender(error.message)
    }
};


const getNewsByKeyword = async () => {
    const keyword = document.getElementById("search-news").value.trim();
    if (keyword) {
        url = new URL(`https://newsapi.org/v2/top-headlines?q=${keyword}&apiKey=${API_KEY}`);
        fetchNews(url);
    } else {
        alert("검색어를 입력해주세요")
    }
}


menus.forEach(menu => menu.addEventListener("click", (event) => getNewsByCategory(event)))


const getLatestNews = async () => {
    url = new URL(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`)
    fetchNews();
}

const getNewsByCategory = async(event) => {
    const category = event.target.textContent.toLowerCase()
    console.log("category", category)

    url = new URL(`https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`);
    fetchNews();
}


const render = () => {
    const newsHTML = newsList.map(news => {
        const description = news.description || "내용없음";
        const truncatedDescription = description.length > 200 
            ? description.slice(0, 200) + "..." 
            : description;
        
        const defaultImage =  "https://search.pstatic.net/sunny/?src=https%3A%2F%2Fwww.shutterstock.com%2Fimage-vector%2Fno-image-available-icon-flat-600w-1240855801.jpg&type=sc960_832"; 
        const imageUrl = news.urlToImage || defaultImage;

    
        const defaultSource = news.source.name || "No source";

    
        const publishedDate = new Date(news.publishedAt).toISOString().split('T')[0];

        return `<div class="row news">
            <div class="col-lg-4"><img class="news-img-size" src="${imageUrl}"/></div>
            <div class="col-lg-8">
                <h2>${news.title}</h2>
                <p>${truncatedDescription}</p>
                <div>${defaultSource} * ${publishedDate}</div>
            </div>
            </div>`;
    }).join(''); 

    document.getElementById("news-board").innerHTML = newsHTML;
};

const errorRender = (errorMessage)=>{
    const errorHTML = `<div class="alert alert-danger" role="alert">
    ${errorMessage}
    </div>`;

    document.getElementById("news-board").innerHTML = errorHTML
}

// 페이지 네이션
const paginationRender = () => {
    const totalPages = Math.ceil(totalResults/pageSize)
    const pageGroup = Math.ceil(page/groupSize)
    
    const lastPage = Math.min(pageGroup * groupSize, totalPages); 
    const firstPage = Math.max(lastPage - (groupSize - 1), 1); 
    let paginationHTML = `
        <li class="page-item ${page === 1 ? "disabled" : ""}" onclick="moveToPage(1)">
            <a class="page-link" href="#" aria-label="First">
                <span aria-hidden="true">&laquo;&laquo;</span> <!-- << -->
            </a>
        </li>
        <li class="page-item ${page === 1 ? "disabled" : ""}" onclick="moveToPage(${page - 1})">
            <a class="page-link" href="#" aria-label="Previous">
                <span aria-hidden="true">&lt;</span> <!-- < -->
            </a>
        </li>`;

    for (let i = firstPage; i <= lastPage; i++) {
        paginationHTML += `
            <li class="page-item ${i === page ? "active" : ""}" onclick="moveToPage(${i})">
                <a class="page-link">${i}</a>
            </li>`;
    }

    paginationHTML += `
        <li class="page-item ${page === totalPages ? "disabled" : ""}" onclick="moveToPage(${page + 1})">
            <a class="page-link" href="#" aria-label="Next">
                <span aria-hidden="true">&gt;</span> <!-- > -->
            </a>
        </li>
        <li class="page-item ${page === totalPages ? "disabled" : ""}" onclick="moveToPage(${totalPages})">
            <a class="page-link" href="#" aria-label="Last">
                <span aria-hidden="true">&raquo;&raquo;</span> <!-- >> -->
            </a>
        </li>`;

    document.querySelector(".pagination").innerHTML = paginationHTML

}

const moveToPage = (pageNum) => {
    page = pageNum
    fetchNews(); 
}
getLatestNews();

