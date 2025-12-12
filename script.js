const reveals = document.querySelectorAll('.reveal');
const container = document.querySelector('#about');
const speed = 0.4;
let posX = 0;
let posY = 0;
let saj;
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

/************************************************************************************** */

// مثال تخزين مصفوفة
let myArray = ["HTML, CSS, JavaScript, TailwindCSS", "PHP, Firebase, MySQL", "Figma", "Git, GitHub, Trello, Jira, GitHub Projects"];

/* // طريقة التخزين
set(ref(db, "projects/"), myArray)
  .then(() => console.log("Array saved!"))
  .catch(err => console.error(err)); */

get(skills).then((ajj) => {
    saj = ajj.val();
    document.querySelector("#front").innerHTML = saj[0];
    document.querySelector("#back").innerHTML = saj[1];
    document.querySelector("#design").innerHTML = saj[2];
    document.querySelector("#tools").innerHTML = saj[3];
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

window.addEventListener("scroll", function () {
    if (window.scrollY >= 920 && window.scrollY <= 950) {
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
})