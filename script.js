const reveals = document.querySelectorAll('.reveal');
const container = document.querySelector('#about');
const speed = 0.4;
let posX = 0;
let posY = 0;
let saj;
let hs;
const hyk = document.querySelector("#hyk");
const observerCallback = entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
        }
    });
};
const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver(observerCallback, observerOptions);
reveals.forEach(section => {
    section.classList.add('opacity-0', 'translate-y-10', 'transition-all', 'duration-700');
    observer.observe(section);
});

function projectFromFirebase() {

    const slider = document.getElementById("slider");
    const slides = document.querySelectorAll("#slider > div");
    const dotsContainer = document.getElementById("dots");
    let autoSlideTimer;

    let index = 0;

    function updateSlider() {
        slider.style.transform = `translateX(-${index * 100}%)`;

        dotsContainer.querySelectorAll("button").forEach((dot, i) => {
            dot.classList.toggle("bg-white", i === index);
            dot.classList.toggle("bg-gray-600", i !== index);
        });
    }

    // Create dots
    slides.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.className =
            "w-3 h-3 rounded-full bg-gray-600 transition hover:bg-white";
        dot.onclick = () => {
            index = i;
            updateSlider();
            resetAutoSlide();
        };
        dotsContainer.appendChild(dot);
    });

    document.getElementById("next").onclick = () => {
        index = (index + 1) % slides.length;
        updateSlider();
        resetAutoSlide();
    };

    document.getElementById("prev").onclick = () => {
        index = (index - 1 + slides.length) % slides.length;
        updateSlider();
        resetAutoSlide();
    };

    function resetAutoSlide() {
        clearInterval(autoSlideTimer);
        startAutoSlide();
    }

    // Auto slide
    function startAutoSlide() {
        autoSlideTimer = setInterval(() => {
            index = (index + 1) % slides.length;
            updateSlider();
        }, 5000);
    }

    startAutoSlide();
    updateSlider();

}


/**************************************FireBase*************************************** */

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getDatabase, ref, push, get, set } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAHbFyz4YD2FP2XFKtB4wZREvQezVm8F9M",
    authDomain: "portfolio-e4752.firebaseapp.com",
    databaseURL: "https://portfolio-e4752-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "portfolio-e4752",
    storageBucket: "portfolio-e4752.firebasestorage.app",
    messagingSenderId: "234390479252",
    appId: "1:234390479252:web:c4f6b85395ac259e08af81",
    measurementId: "G-W6SGSGGXZC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);
const contactRef = ref(db, "contacts/");
const skills = ref(db, "skills/");
const projects = ref(db, "projects/");
const skill = ref(db, "skill/");
const project = ref(db, "project/");

/************************************************************************************** */

/* push(project, {
        des: "Modern virtual workspace.",
        img: "https://maghreb.simplonline.co/_next/image?url=https%3A%2F%2Fsimplonline-v3-prod.s3.eu-west-3.amazonaws.com%2Fmedia%2Fimage%2Fpng%2Fchatgpt-image-nov-16-2025-02-15-39-pm-691a1cfdb1aa0331529428.png&w=1280&q=75",
        link: "https://yakhlafhoussam.github.io/Brief-Soutenance-Crois-e-1-WorkSphere---Virtual-Workspace-/",
        title: "WorkSphere"
    }).then(() => {
        sendsucces();
        document.getElementById("contactForm").reset();
    }).catch((error) => {
        alert("Error saving message: " + error);
    }); */

get(skill).then((ajj) => {
    saj = ajj.val();
    const key = Object.keys(saj)[0];

    const backend = saj[key].backend;
    const frontend = saj[key].frontend;
    const design = saj[key].design;
    const tools = saj[key].tools;

    document.querySelector("#front").innerHTML = frontend;
    document.querySelector("#back").innerHTML = backend;
    document.querySelector("#design").innerHTML = design;
    document.querySelector("#tools").innerHTML = tools;

})

get(project).then((ajyk) => {
    hs = ajyk.val();
    document.querySelector("#slider").innerHTML = "";
    Object.values(hs).forEach(item => {
        document.querySelector("#slider").insertAdjacentHTML("afterbegin", `
           <div class="min-w-full h-full flex flex-col items-center text-center px-6">
       <a class="mb-6 w-full h-5/6 max-w-md md:max-w-full" target="_blank" rel="noopener noreferrer" href='${item.link}'>
       <img
         src='${item.img}'
         class="w-full h-full object-cover rounded-2xl shadow-lg"
       /></a>
       <h3 class="text-2xl font-bold mb-2">${item.title}</h3>
       <p class="text-gray-400 max-w-md">
         ${item.des}
       </p>
     </div>
           `)
    });
    projectFromFirebase();
})



function sendsucces() {
    gsap.to(document.querySelector("#toast"), {
        x: 400,
        duration: 0.25,
        onComplete: () => {
            gsap.to(document.querySelector("#toast"), {
                delay: 2,
                duration: 2,
                opacity: 0,
                onComplete: () => {
                    gsap.to(document.querySelector("#toast"), {
                        duration: 0,
                        x: -330,
                        opacity: 1,
                    });
                }
            });
        }
    });
}

document.getElementById("contactForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.querySelector('input[name="name"]').value;
    const email = document.querySelector('input[name="email"]').value;
    const message = document.querySelector('textarea[name="message"]').value;

    push(contactRef, {
        name: name,
        email: email,
        message: message,
        createdAt: new Date().toISOString()
    }).then(() => {
        sendsucces();
        document.getElementById("contactForm").reset();
    }).catch((error) => {
        alert("Error saving message: " + error);
    });
});

function enable(e) {
    document.querySelector('body').style.overflow = 'hidden';
    e.preventDefault();
    posX += e.deltaY * speed;
    posY += e.deltaX * speed;

    if (posX < 0) posX = 0;
    if (posX > 5775) posX = 5775;

    document.querySelector("#aboutinfo").style.transform = `translate(${-posX}px)`;
    if (posX == 0 || posX == 5775) {
        document.querySelector('body').removeEventListener('wheel', enable);
        document.querySelector('body').style.overflow = 'auto';
    }
}

let maxscroll = document.querySelector("body").scrollHeight - document.documentElement.clientHeight;

window.addEventListener("scroll", function () {
    let scrolling = (window.scrollY / maxscroll) * 100;
    document.querySelector("#progressbar").style.width = scrolling + "%"
    if (window.scrollY >= 880 && window.scrollY <= 900 && window.innerWidth >= 1024) {
        document.querySelector('body').addEventListener('wheel', enable, { passive: false });
    }
});



document.addEventListener("DOMContentLoaded", event => {
    gsap.to(hyk, {
        duration: 5,
        ease: "none",
        color: "#000000",
        yoyo: true,
        repeat: -1,
    });

    const tl = gsap.timeline({ repeat: -1, });

    tl.to("#load1", { color: "#000000", duration: 2.5, ease: "none" })
        .to("#load2", { color: "#000000", duration: 2.5, ease: "none" }, "-=1.5")
        .to("#load3", { color: "#000000", duration: 2.5, ease: "none" }, "-=1.5")
        .to("#load1", { color: "#ffffff", duration: 2.5, ease: "none" }, "-=1.5")
        .to("#load2", { color: "#ffffff", duration: 2.5, ease: "none" }, "-=1.5")
        .to("#load3", { color: "#ffffff", duration: 2.5, ease: "none" }, "-=1.5");

    gsap.from("#saj", {
        duration: 8,
        color: "#000000",
        ease: "none",
    });

    gsap.to("#moon", {
        duration: 2,
        ease: "none",
        opacity: 1,
    });

    gsap.to("#sun", {
        duration: 2,
        ease: "none",
        opacity: 1,
    });

    gsap.to("#moon", {
        x: -600,
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: true,
        },
    });

    gsap.to("#sun", {
        x: +600,
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: true,
        },
    });

    gsap.to("#star", {
        opacity: 0,
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: true,
        },
    });
})