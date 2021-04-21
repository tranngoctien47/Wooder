//menu
let nav = document.querySelector('.nav');
let btnMenu = document.querySelector('header .btnmenu');


// btnMenu.addEventListener('click', () => {
//     nav.classList.toggle('active');
//     btnMenu.classList.toggle('active');
// })

//hoac
function preventDefault(e) {
    e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

// modern Chrome requires { passive: false } when adding event
var supportsPassive = false;
try {
    window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
        get: function () { supportsPassive = true; }
    }));
} catch (e) { }

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

// call this to Disable
function disableScroll() {
    window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
    window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
    window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
    window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}

// call this to Enable
function enableScroll() {
    window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
    window.removeEventListener('touchmove', preventDefault, wheelOpt);
    window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
}



btnMenu.addEventListener('click', toggleMenu);
function toggleMenu() {
    nav.classList.toggle('active');
    this.classList.toggle('active');
    if (this.classList.contains('active')) {
        disableScroll();
    }
    else {
        enableScroll();
    }
}




//Lang

let lang = $('.lang');
let langSelect = $('.lang .lang__select a')
let spanLangCurrent = $('.lang .lang__current span');

lang.on('click', function (e) {
    e.stopPropagation();
    lang.toggleClass('active');
})

langSelect.click(function () {
    let text = $(this).html();
    let spanCurrent = spanLangCurrent.text();
    $('.lang__current span').text(text);
    $(this).text(spanCurrent);
})

// langSelect.each(() => {
//     $(this).click(function () {
//         let text = $(this).html();
//         let spanCurrent = spanLangCurrent.text();
//         spanLangCurrent.innerHTML = text;
//         item.innerHTML = spanCurrent;
//     })
// })

$(document).on('click', function () {
    lang.removeClass('active')
})


//jquery silder

// let sliderListItem = $('.slider__list-item');
// let number = $('.slider__bottom-paging .number')
// let dotted = $('.slider__bottom-paging .dotted li')
// let currenSlider = 0;

// sliderListItem.each(function (index) {
//     currenSlider = $(this).hasClass('active') ? index : currenSlider;
//     // if (item.classList.contains('active')) {
//     //     currenSlider = index
//     // }
// })

// function showNumber(index) {
//     number.html((currenSlider + 1).toString().padStart(2, '0'));
// }
// showNumber(currenSlider + 1);
// dotted[currenSlider].classList.add('active');


// function showDotted(index) {
//     dotted[currenSlider].classList.remove('active');
//     dotted[index].classList.add('active');
// }


// $(document).on('click', '.control__btn.next', function () {
//     if (currenSlider < sliderListItem.length - 1) {
//         goTo(currenSlider + 1)
//     }
//     else {
//         goTo(0)
//     }
// })

// $(document).on('click', '.control__btn.prev', function () {
//     if (currenSlider > 0) {
//         goTo(currenSlider - 1)
//     }
//     else {
//         goTo(sliderListItem.length - 1);
//     }

// })
// function goTo(index) {
//     sliderListItem[currenSlider].classList.remove('active')
//     sliderListItem[index].classList.add('active');
//     showDotted(index)
//     currenSlider = index;
//     showNumber(currenSlider + 1);

// }

// dotted.each(function (index) {
//     $(this).on('click', function () {
//         goTo(index);
//     })
// })

$('.photos__carousel').flickity({
    // cellAlign: 'left',
    // contain: true,
    freeScroll: true,
    wrapAround: true,
    prevNextButtons: false,
    pageDots: false
})


let $carousel = $('.slider__list');
$carousel.flickity({
    cellAlign: 'left',
    contain: true,
    wrapAround: true,
    prevNextButtons: false,

    on: {
        ready: function () {
            let dotted = $('.flickity-page-dots');
            paging = $('.slider__bottom .slider__bottom-paging .dotted');
            dotted.appendTo(paging);

        },
        change: function (index) {
            let number = $('.slider__bottom .slider__bottom-paging .number');
            let indexPage = index + 1;
            number.text(indexPage.toString().padStart(2, 0));
        }
    }
});

$('.slider__bottom .slider__bottom-control .prev').on('click', function () {
    $carousel.flickity('previous');
})
$('.slider__bottom .slider__bottom-control .next').on('click', function () {
    $carousel.flickity('next');
})



//galary thư viên
var initPhotoSwipeFromDOM = function (gallerySelector) {
    var parseThumbnailElements = function (el) {
        var thumbElements = el.childNodes,
            numNodes = thumbElements.length,
            items = [],
            figureEl,
            linkEl,
            size,
            item;
        for (var i = 0; i < numNodes; i++) {
            figureEl = thumbElements[i]; // <figure> element
            if (figureEl.nodeType !== 1) {
                continue;
            }
            linkEl = figureEl.children[0]; // <a> element
            size = linkEl.getAttribute('data-size').split('x');
            item = {
                src: linkEl.getAttribute('href'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)
            };
            if (figureEl.children.length > 1) {
                item.title = figureEl.children[1].innerHTML;
            }
            if (linkEl.children.length > 0) {
                // <img> thumbnail element, retrieving thumbnail url
                item.msrc = linkEl.children[0].getAttribute('src');
            }
            item.el = figureEl; // save link to element for getThumbBoundsFn
            items.push(item);
        }
        return items;
    };
    var closest = function closest(el, fn) {
        return el && (fn(el) ? el : closest(el.parentNode, fn));
    };
    var onThumbnailsClick = function (e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;
        var eTarget = e.target || e.srcElement;
        var clickedListItem = closest(eTarget, function (el) {
            return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
        });
        if (!clickedListItem) {
            return;
        }
        var clickedGallery = clickedListItem.parentNode,
            childNodes = clickedListItem.parentNode.childNodes,
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index;
        for (var i = 0; i < numChildNodes; i++) {
            if (childNodes[i].nodeType !== 1) {
                continue;
            }
            if (childNodes[i] === clickedListItem) {
                index = nodeIndex;
                break;
            }
            nodeIndex++;
        }
        if (index >= 0) {
            openPhotoSwipe(index, clickedGallery);
        }
        return false;
    };
    var photoswipeParseHash = function () {
        var hash = window.location.hash.substring(1),
            params = {};
        if (hash.length < 5) {
            return params;
        }
        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
            if (!vars[i]) {
                continue;
            }
            var pair = vars[i].split('=');
            if (pair.length < 2) {
                continue;
            }
            params[pair[0]] = pair[1];
        }
        if (params.gid) {
            params.gid = parseInt(params.gid, 10);
        }
        return params;
    };
    var openPhotoSwipe = function (index, galleryElement, disableAnimation, fromURL) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;
        items = parseThumbnailElements(galleryElement);
        options = {
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),
            getThumbBoundsFn: function (index) {
                var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect();

                return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
            },
            showAnimationDuration: 0,
            hideAnimationDuration: 0
        };
        if (fromURL) {
            if (options.galleryPIDs) {
                for (var j = 0; j < items.length; j++) {
                    if (items[j].pid == index) {
                        options.index = j;
                        break;
                    }
                }
            } else {
                options.index = parseInt(index, 10) - 1;
            }
        } else {
            options.index = parseInt(index, 10);
        }
        if (isNaN(options.index)) {
            return;
        }
        if (disableAnimation) {
            options.showAnimationDuration = 0;
        }
        gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    };
    var galleryElements = document.querySelectorAll(gallerySelector);
    for (var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i + 1);
        galleryElements[i].onclick = onThumbnailsClick;
    }
    var hashData = photoswipeParseHash();
    if (hashData.pid && hashData.gid) {
        openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true);
    }
};


initPhotoSwipeFromDOM('.carousel-img');






// })

//Jquery srollTo Header 
let header = $('header')
let heightHeader = $('header').height();
// hoặc  header.clientHeight;
let heightSilder = $('.slider').height();

$(document).on('scroll', function () {
    let scrollY = window.pageYOffset
    if (scrollY > heightSilder - heightHeader) {
        $('header').addClass('active');
    }
    else {
        $('header').removeClass('active');
    }
})



// srollTo section

let menus = $('header .menu a')
let sections = [];
let navs = $('.nav a')
let sectionNav = [];


function removeActiveMenus() {
    $('header .menu a.active').removeClass('active');
}

navs.each(function () {
    let href = $(this).attr('href');
    let classNames = href.replace('#', '');

    let section = $('.' + classNames);
    sectionNav.push(section);

    $(this).click(function () {
        $('.btnmenu').removeClass('active');
        $('.nav').removeClass('active');
        enableScroll();
        removeActiveMenus();
        let positionMenus = section.offset().top;
        window.scrollTo({
            top: positionMenus - heightHeader + 1,
            behavior: 'smooth',
        })
    })
})

menus.each(function () {
    let href = $(this).attr('href');
    let className = href.replace('#', '');
    let section = $('.' + className)
    sections.push(section);

    $(this).click(function () {
        let positionSection = section.offset().top;
        window.scrollTo({
            top: positionSection - heightHeader + 1,
            behavior: 'smooth',
        });
        removeActiveMenus();
        $(this).addClass('active');

    })
})

$(document).on('scroll', function (e) {
    let positionScroll = window.pageYOffset;
    sections.forEach((item, index) => {

        if (positionScroll > item.offset().top - heightHeader && positionScroll < item.offset().top + item.height()) {
            removeActiveMenus();
            $(menus[index]).addClass('active');
        }
        else {
            $(menus[index]).removeClass('active');
        }
    })
})

//popup video


// let playVideo = document.querySelectorAll('.play__button');
let popupVideo = $('.popup-video');
let closeVideo = $('.close');
let iframe = $('.popup-video iframe');
let videoItem = $('.video__item-img')

videoItem.each(function () {
    $(this).click(function () {
        let video_id = $(this).attr('data-video-id')
        iframe.attr('src', 'https://www.youtube.com/embed/' + video_id + '?rel=0&autoplay=1');
        popupVideo.css('display', 'flex')
        if (popupVideo.css('display', 'flex')) {
            disableScroll();
            // console.log("ok");
        }


    })
})

// playVideo.forEach((playvideo) => {
//     playvideo.addEventListener('click', () => {
//         let video_id = playvideo.getAttribute('data-video-id')
//         iframe.setAttribute('src', 'https://www.youtube.com/embed/' + video_id + '?rel=0&autoplay=1');
//         console.log(iframe);
//         popupVideo.style.display = 'flex';
//     })
// })

closeVideo.click(function () {
    iframe.attr('src', '');
    popupVideo.css('display', 'none')
    enableScroll();


})

$(document).on('click', '.popup-video', function () {
    iframe.attr('src', '');
    popupVideo.css('display', 'none')
    enableScroll();

})




//backtotop

let backtotop = $('.backtotop')
let heightSilderBTT = document.querySelector('.slider__list').clientHeight
console.log(heightSilderBTT);

backtotop.click(function () {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    })
})

$(document).on('scroll', function () {
    let scrollBackToTop = window.pageYOffset;
    if (scrollBackToTop > heightSilderBTT) {
        $('.backtotop').addClass('active');
    }
    else {
        $('.backtotop').removeClass('active');
    }
})


// window.addEventListener("resize", function () {
//     location.reload();
// })



