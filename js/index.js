function $(container) {
    return document.querySelector(container)
}

function $$(container) {
    return document.querySelectorAll(container)
}


function createSlider(container, duration, callback) {
    let firstItem = container.querySelector(".slider-item");
    let cw = container.clientWidth;
    let currentIndex = 0;
    let itemCount = container.children.length;
    let timer = null;

    container.ontouchstart = function (e) {
        let touchBegin = e.touches[0].clientX;
        let touchBeginY = e.touches[0].clientY;
        let ml = firstItem.style.marginLeft ? parseFloat(firstItem.style.marginLeft) : 0;
        autoStop();
        firstItem.style.transition = 'none';
        container.ontouchmove = function (t) {
            let moveNowX = t.touches[0].clientX;
            let moveNowY = t.touches[0].clientY;
            let moveX = moveNowX - touchBegin;
            let moveY = moveNowY - touchBeginY;
            // 如果横向的移动距离小于了纵向的移动距离，啥也不做
            if (Math.abs(moveY) > Math.abs(moveX)) {
                return;
            }
            let disMove = ml + moveX;
            let minMl = -(itemCount - 1) * cw;
            if (disMove < minMl) {
                disMove = minMl
            } else if (disMove > 0) {
                disMove = 0
            }
            firstItem.style.marginLeft = disMove + "px"
            t.preventDefault();
        }
        container.ontouchend = function (e) {
            let disEnd = e.changedTouches[0].clientX;
            let disX = disEnd - touchBegin;
            if (disX > 3) {
                switchTo(currentIndex - 1)
            }
            if (disX < -3) {
                switchTo(currentIndex + 1)
            }
            autoStart();
        }
    }

    function autoStart() {
        if (timer || duration === 0) {
            return;
        }
        timer = setInterval(function () {
            switchTo((currentIndex + 1) % itemCount);
        }, duration);
    }

    function autoStop() {
        clearInterval(timer)
        timer = null;
    }
    autoStart();
    setItemHeight();

    function setItemHeight() {
        container.style.height = container.children[currentIndex].offsetHeight + "px";
    }

    function switchTo(index) {
        if (index < 0) {
            index = 0
        } else if (index > itemCount - 1) {
            index = itemCount - 1
        }
        firstItem.style.transition = ".5s";
        firstItem.style.marginLeft = -index * cw + "px";
        currentIndex = index
        callback && callback(index)
        setItemHeight()
    }
    return switchTo;
}


/**
 * 
 * @param {*} dom 
 * 创建可点击可滑动区域，且上部分为标题
 */
function createBlock(dom) {
    let dom2 = dom.querySelector(".slider-container")
    let blockmenu = dom.querySelector(".block-menu");
    let goto = createSlider(dom2, 0, function (index) {
        let ac = blockmenu.querySelector(".active")
        ac && ac.classList.remove("active")
        blockmenu.children[index].classList.add("active");
    })
    for (let index = 0; index < blockmenu.children.length; index++) {
        const element = blockmenu.children[index];
        element.onclick = function () {
            goto(index);
        }
    }
}

// banner
(function () {
    let dom1 = $(".banner .slider-container");
    let goto = createSlider(dom1, 3000, function (index) {
        let oldactive = $(".banner .dots .active")
        oldactive && oldactive.classList.remove("active");
        let a = $(".banner .dots").children[index]
        a.classList.add("active");
    })
})();

// menu
(function () {
    let expandmenu = $(".menu .expand")
    let menulist = $(".menu .menu-list")
    let expandFlag = false;
    expandmenu.onclick = function () {
        expandFlag = !expandFlag;
        let expandicon = this.querySelector(".txt")
        let expandspr = this.querySelector(".spr")
        if (expandFlag) {
            // 展开
            expandicon.innerText = "折叠"
            expandspr.classList.add("spr_collapse");
            expandspr.classList.remove("spr_expand");
            //     flex-wrap: wrap;
            menulist.style.flexWrap = "wrap"
        } else {
            // 折叠
            expandicon.innerText = "展开"
            expandspr.classList.add("spr_expand");
            expandspr.classList.remove("spr_collapse");
            menulist.style.flexWrap = "nowrap"
        }
    }
})();

// news-list
(async function () {
    // 获取数据
    const res = await fetch("./data/news.json").then(req => {
        return req.json()
    })
    let html = Object.values(res).map(item => {
        return `<div class="slider-item">
        ${item.map(ii => {
            return `<div class="item ${ii.type}">
            <a href="#">${ii.title}</a>
            <span>${ii.pubDate}</span>
          </div>`
        }).join("")}
      </div>`
    }).join("")
    let slidercontainer = $('.news-list .slider-container')
    slidercontainer.innerHTML = html
    let dom = $(".news-list")
    createBlock(dom);
})();


// hero-list
(async function () {
    const res = await fetch("./data/hero.json").then(req => {
        return req.json();
    })
    // console.log(res);
    /* 
        1-战士
        2-法师
        3-坦克
        4-刺客
        5-射手
        6-辅助
    */

    let slidercontainer = $('.hero-list .slider-container')
    for (let index = 0; index < 7; index++) {
        let sliderItem = document.createElement("div")
        sliderItem.classList.add("slider-item");
        let datas = res.filter(item => {
            if (index == 0) {
                return item.hot == 1
            } else {
                return item.hero_type == index || item.hero_type2 == index
            }

        })
        let sitem = datas.map(heroi => {
            return `<a href="">
            <img
              src="https://game.gtimg.cn/images/yxzj/img201606/heroimg/${heroi.ename}/${heroi.ename}.jpg"
              alt=""
            />
            <div>${heroi.cname}</div>
          </a>`
        }).join("")
        sliderItem.innerHTML = sitem
        slidercontainer.appendChild(sliderItem)
    }
    let dom = $(".hero-list")
    createBlock(dom);
})();

// video-list
(async function () {
    const res = await fetch("./data/video.json").then(req => {
        return req.json();
    })
    let slidercontainer = $('.video-list .slider-container')
    for (const key in res) {
        let element = res[key].map(item => {
            return `<a href="${item.link}">
            <img
              src="${item.cover}"
              alt=""
            />
            <div class="title">${item.title}</div>
            <div class="aside">
              <div class="left">
                <span class="spr spr_videonum"></span>
                <span>${item.playNumber}</span>
              </div>
              <div class="right">${item.pubDate}</div>
            </div>
          </a>`
        }).join("");
        let sliderItem = document.createElement("div")
        sliderItem.classList.add("slider-item");
        sliderItem.innerHTML = element
        slidercontainer.appendChild(sliderItem)
    }
    let dom = $(".video-list")
    createBlock(dom);
})();

