
//Accessing window width;
var windowWidth = window.innerWidth;

//Slider Functionality
const imageSlide = document.getElementById("imageSlide");

// Initialization of Variables
let i = 0;

// Slideshow Array
let images = [];

// Cycle time in milliseconds
let time = 6000;

// Set array values
images[0] = "Assets/Discord-Screenshots/cheers4.jpg";
images[1] = "Assets/Discord-Screenshots/meditate.jpg";
images[2] = "Assets/Discord-Screenshots/schnell.jpg";
images[3] = "Assets/Discord-Screenshots/ghost-moment.jpg"

// Cycle through images
switchImage = function() {
    imageSlide.src = images[i];
    if (i < images.length - 1) 
    {
        i++;
    } else {
        i = 0;
    }
    setTimeout("switchImage()", time);
};

// Initialize Sound Variables
var ghostAudio1 = new Audio("Assets/Audio/character select.mp3");
var ghostAudio2 = new Audio("Assets/Audio/synth.mp3");

//Function that compileds and renders the data for the OurOffering template using Handlebars.js
categoryContentFill = function() {
    
    //Fetch and compile template
    var template = document.getElementById("template").innerHTML;
    var compiled_template = Handlebars.compile(template);
    
    //Initialize Arrays with data according to theme
    var serverContent = [
        {
            "id" : "content-sharing",
            "image-path" : "Assets/Discord-Screenshots/Europa-sunrise.jpg",
            "alt" : "Europa-Sunrise",
            "Name" : "Content Sharing : Creativity is key",
            "Paragraph" : "We all know what it's like to be passionate about a game, and we all know what its like to find or create something worthy of greateness that ties into that passion - You want to share it with the world. Well luckily, in our community, we are extremely open to any of its members sharing something that they are proud of. We have memebers sharing things like : Graphic design projects, hand made artworks, real-life replicas of in-game weapons, and a bunch more!"
        },{
            "id" : "server-competitions",
            "image-path" : "Assets/destiny-2.jpg",
            "alt" : "Image of Destiny Characters",
            "Name" : "Server Competitions : Share your flare, if you dare",
            "Paragraph" : "We host server-side competitions, like whose got the best dressed character, where all you gamers can compete to win a multitude of prizes, ranging from in-game vouchers, to computer hardware!"
        }];
    
    var gameContent = [
        {
            "id" : "game-competitions",
            "image-path" : "Assets/Discord-Screenshots/trippy.jpg",
            "alt" : "Image of Destiny Challenger",
            "Name" : "In-Game Competitions : Test your might",
            "Paragraph" : "Got a competitive side? Feeling like walking the talk? Well your match is about to be met. We will soon start hosting Gaming Competitions where you can go head-to-head against some of South Africa's finest gaming talent. You choose your battlefield, we will meet you there."
        },{
            "id" : "raids",
            "image-path" : "Assets/Discord-Screenshots/wow.jpg",
            "alt" : "Mysterious Destiny Lair",
            "Name" : "Organised Raids : FOR THE L00T",
            "Paragraph" : "There is something special about this game we play - Destiny 2. It's a massive, ever-growing and evolving world, that is filled from head-to-toe with intricate and interesting lore. A world where everything has meaning. Each unique enemy you face, each weapon you fight to aquire, each dungeon you delve into - everything means something. Even after swallowing all of it in, there is a looming mountain in the distance, veiled with clouds, that calls to you. This is end-game content, what we call 'Raids'. It is the reason most of us came here, it is the reason most of us stay. We help fellow beginners out by accompanying them into these depths, we show them the ropes to navigate their way through. As an old friend once said before defending the last city against a cabal invasion, 'FOR THE L00T!'"
        }];
    
    var emotionalContent = [
        {
           "id" : "moral-support",
            "image-path" : "Assets/Discord-Screenshots/tower-hug.jpg",
            "alt" : "Destiny Characters Hugging",
            "Name" : "Moral Support : Never alone",
            "Paragraph" : "We can all, as humans, handle the heat of life, however, sometimes it gets a tad bit too hot. In times like these, we all seclude ourselves to regain traction and perspective over our current situation, and in times like these, it's always good to have a friend around. We can be those friends. Lets hug it out."
        },{
            "id" : "companionship",
            "image-path" : "Assets/destiny-2.jpg",
            "alt" : "Destiny 2 Characters",
            "Name" : "Companionship : Apart of something bigger",
            "Paragraph" : "Yes, it is great to be on an awesome server such as this. Yes, it is radical to be able to meet like-minded individuals, and chat to them about your favorite topics. What is even more awesome is knowing that you, and your team, are helping to populate the South African gaming space with a positive mentality. Leaving no trace of hostility, profanity or bad sportsmanship. Everywhere we go, we ensure that we leave the space filled with better vibes than it was when we found it, and that is good work."
        },{
            "id" : "chill-spot",
            "image-path" : "Assets/Discord-Screenshots/jamming.jpg",
            "alt" : "Destiny Character Jamming Guitar",
            "Name" : "Good Company - A place to kick it",
            "Paragraph" : "When the going of intergalactic warfare gets tough, come and kick it with us. Some might say  the Titan is the only class that deserves to get serenated via guitar. Others say that the Hunter is the only class that is skilled enough to play guitar. Regardless of politics or bias towards any set class, it never gets better than this moment right here."
        }];
    
    // Run a for loop for each theme to rendered the compiled template and append the data to the appropriate element
    for (var i = 0; i < serverContent.length; i++) {
        var rendered = compiled_template(serverContent[i]);
        document.getElementById("target").innerHTML += rendered;
    }
    
    for (var i = 0; i < emotionalContent.length; i++) {
        var rendered = compiled_template (emotionalContent[i]);
        document.getElementById("target").innerHTML += rendered;
    }
    
    for (var i = 0; i < gameContent.length; i++) {
        var rendered = compiled_template (gameContent[i]);
        document.getElementById("target").innerHTML += rendered;
    }

    //Fetch the category elements
    var allOfferings = document.getElementById("allOfferings");
    var serverOfferings = document.getElementById("serverOfferings");
    var gameOfferings = document.getElementById("gameOfferings");
    var emotionalOfferings = document.getElementById("emotionalOfferings");
    var contentHeading = document.getElementById("offeringHeading");

    //Add event listeners to each category element to clear and repopulate the template with the appropriate data if clicked
    
        //This specific event listener requires a for loop to run through each declared array so that all content can be appended
    allOfferings.addEventListener("click", function(event) {
        contentHeading.innerHTML = "All Offerings";
        document.getElementById("target").innerHTML = "";
        for (var i = 0; i < serverContent.length; i++) 
        {
            var rendered = compiled_template(serverContent[i]);
            document.getElementById("target").innerHTML += rendered;
        };
        for (var i = 0; i < gameContent.length; i++)
            {
                var rendered = compiled_template(gameContent[i]);
                document.getElementById("target").innerHTML += rendered;
            }
        for (var i = 0; i < emotionalContent.length; i++) 
        {
            var rendered = compiled_template(emotionalContent[i]);
            document.getElementById("target").innerHTML += rendered;    
        }
    });

    serverOfferings.addEventListener("click", function(event) {
        contentHeading.innerHTML = "Server Offerings";
        document.getElementById("target").innerHTML = "";
        for (var i = 0; i < serverContent.length; i++) {
            var rendered = compiled_template(serverContent[i]);
            document.getElementById("target").innerHTML += rendered;
        };
    });    
    
    gameOfferings.addEventListener("click", function(event) {
        contentHeading.innerHTML = "Game Offerings";
        document.getElementById("target").innerHTML = "";
        for (var i = 0; i < gameContent.length; i++) {
            var rendered = compiled_template(gameContent[i]);
            document.getElementById("target").innerHTML += rendered;
        };
    });    
    
    emotionalOfferings.addEventListener("click", function(event) {
        contentHeading.innerHTML = "Emotional Offerings";
        document.getElementById("target").innerHTML = "";
        for (var i = 0; i < emotionalContent.length; i++) {
            var rendered = compiled_template(emotionalContent[i]);
            document.getElementById("target").innerHTML += rendered;
        };
    });
    
};

//Declare Array for Photo Gallery
var photoGalleryImages = [
    {
        "src" : "Assets/Discord-Screenshots/big-boy.jpg",
        "alt" : "Destiny Characters Standing On Enemy"
    },{
        "src" : "Assets/Discord-Screenshots/cheers.jpg",
        "alt" : "Destiny Characters Chilling"
    },{
        "src" : "Assets/Discord-Screenshots/distraction.jpg",
        "alt" : "Destiny Characters Distracting Enemny"
    },{
        "src" : "Assets/Discord-Screenshots/howl.jpg",
        "alt" : "Destiny Character Ritual"
    }];

//Declare Array for the Latest Content
var latestContentImages = [
    {
        "id" : "id0",
        "src" : "Assets/Discord-Screenshots/cheers3.jpg",
        "alt" : "Guardians Having a Drink",
        "p" : "Here we can see the trademark screenshot taken by many guardians after a night-long raid. This is a common sign of triump amongst the stars."
    }, {
        "id" : "id1",
        "src" : "Assets/Discord-Screenshots/earth-beauty.jpg",
        "alt" : "Scenic Beauty of Earth",
        "p" : "Here we can see a magnificent moment captured by one of out players. The way the ambient purple lighting of the sky contrasts on the mountains is just breathtaking."
    }, {
        "id" : "id2",
        "src" : "Assets/Discord-Screenshots/meditate2.jpg",
        "alt" : "Player In Contemplation Regarding In-Game Puzzle",
        "p" : "Sometimes, we all need to take a seat and reassess the situation. That is precisely what this player is doing - whilst contemplating the puzzle above them."
    }, {
        "id" : "id3",
        "src" : "Assets/Discord-Screenshots/jamming.jpg",
        "alt" : "Destiny Players Jamming",
        "p" : "After a long day of saving the Last City from imminent doom, the battle-worn guardians need to relax too. Good drink and good music soothes the soul."
    }, {
        "id" : "id4",
        "src" : "Assets/Discord-Screenshots/stars.jpg",
        "alt" : "Players Traveling Through The Stars",
        "p" : "A rare moment captured during one of the never-to-be-seen-again raids : Spire of Stars. This content was permenantly removed from the game. Consider yourself lucky to even see this."
    }
]

//Function that compiles and renderes the template for the Photo Gallery using Handlebars.js - there are two templates
injectGallery = function() {
    var galleryTemplate1 = document.getElementById("galleryTemplate").innerHTML;
    var compiledGalleryTemplate1 = Handlebars.compile(galleryTemplate1);
    //For loop that runs appends each array value to the appropriate element
    for (var i = 0; i < (photoGalleryImages.length/2); i++)
        {
            var galleryRendered1 = compiledGalleryTemplate1(photoGalleryImages[i]);
            document.getElementById("galleryTarget1").innerHTML += galleryRendered1;
        }
    
    var galleryTemplate2 = document.getElementById("galleryTemplate").innerHTML;
    var compiledGalleryTemplate2 = Handlebars.compile(galleryTemplate1);
    //For loop that runs appends each array value to the appropriate element
    for (var i = (photoGalleryImages.length/2); i < photoGalleryImages.length; i++)
        {
            var galleryRendered2 = compiledGalleryTemplate1(photoGalleryImages[i]);
            document.getElementById("galleryTarget2").innerHTML += galleryRendered2;
        }
}

//Function that compiles and renderes the template for the Latest Content using Handlebars.js
injectLatestContent = function() {
    var latestContentTemplate = document.getElementById("latestTemplate").innerHTML;
    var compiledLatestContentTemplate = Handlebars.compile(latestContentTemplate);
    //For loop that runs appends each array value to the appropriate element
    for (var i = 0; i < latestContentImages.length; i++)
        {
            var latestContentRendered = compiledLatestContentTemplate(latestContentImages[i]);
            document.getElementById("LatestTarget").innerHTML += latestContentRendered;
        }
};

//Function that adds functionality to the Chatbot
chatbotOptions = function() {
    //Fetch the Chatbot element from the DOM
    var chatbot = document.getElementById("chatbot");
    //Fetch all the button elements from the DOM
    var minimizeButton = document.getElementById("minimize-button");
    var fullMinimizeButton = document.getElementById("fullMinimizeButton");
    var expandButton = document.getElementById("expand-button");
    var minimizeFooter = document.getElementById("minimizeFooter");
    var optionsButton = document.getElementById("options-button");
    var smallFontButton = document.getElementById("smallFontButton")
    var minimizeOptionsButton = document.getElementById("minimizeOptionsButton");
    var largeFontButton = document.getElementById("largeFontButton");
    var lightModeButton = document.getElementById("lightModeButton");
    var darkModeButton = document.getElementById("darkModeButton");
    //Fetch the different footer elements from the DOM 
    var fixedFooter = document.getElementById("fixed-footer");
    var fixedFooterContent = document.getElementById("fixed-footer-content")
    var fullFooter = document.getElementById("fullFooter");
    
    //Add event listener to minimize the chatbot and its footer
    minimizeButton.addEventListener("click", function(event) {
        chatbot.style.display = "none";
        minimizeFooter.style.display = "block";
        ghostAudio1.play();
    });    
    
    //Add event listener to minimize the Chatbot and full options footer
    fullMinimizeButton.addEventListener("click", function(event) {
        chatbot.style.display = "none";
        fullFooter.style.display = "none";
        minimizeFooter.style.display = "block";
        ghostAudio1.play();
    });
    
    //Add event listener to display the chatbot and footer
    expandButton.addEventListener("click", function(event) {
        chatbot.style.display = "block";
        fixedFooter.style.display = "block";
        minimizeFooter.style.display = "none";
        ghostAudio2.play();
    });

    //Add event listener to display the chatbot and full options footer
    optionsButton.addEventListener("click", function(event) {
        fixedFooter.style.display = "none";
        fullFooter.style.display = "block";
        ghostAudio2.play();
    });
    
    //Add event listener to return from full to normal footer
    minimizeOptionsButton.addEventListener("click", function(event) {
        fullFooter.style.display = "none";
        fixedFooter.style.display = "block";
        ghostAudio1.play();
    });
    
    //Add event listener to replace globally used font variable values with the enlarged values
    largeFontButton.addEventListener("click", function(event) {
        document.documentElement.style.setProperty("--h1Size", "var(--largeH1Size)");
        document.documentElement.style.setProperty("--h2Size", "var(--largeH2Size)");
        document.documentElement.style.setProperty("--h3Size", "var(--largeH3Size)");
        document.documentElement.style.setProperty("--spanSize", "var(--largeSpanSize)");
        document.documentElement.style.setProperty("--paraSize", "var(--largeParaSize)");
        document.documentElement.style.setProperty("--footerSize", "var(--largeFooterSize)");
        document.documentElement.style.setProperty("--naviButtonSize", "var(--largeNaviButtonSize)");
        document.documentElement.style.setProperty("--fixedFooterSize", "var(--largeFixedFooterSize)");
        document.documentElement.style.setProperty("--fullFooterSize", "var(--largeFullFooterSize)");
        document.documentElement.style.setProperty("--liSize", "var(--largeLiSize)");
        document.documentElement.style.setProperty("--iSize", "var(--largeISize)");
        console.log("lol");
    });
    
    //Add event listener to replace globally used font variable values with the small/normal values
    smallFontButton.addEventListener("click", function(event) {
        document.documentElement.style.setProperty("--h1Size", "var(--smallH1Size)");
        document.documentElement.style.setProperty("--h2Size", "var(--smallH2Size)");
        document.documentElement.style.setProperty("--h3Size", "var(--smallH3Size)");
        document.documentElement.style.setProperty("--spanSize", "var(--smallSpanSize)");
        document.documentElement.style.setProperty("--paraSize", "var(--smallParaSize)");
        document.documentElement.style.setProperty("--footerSize", "var(--smallFooterSize)");
        document.documentElement.style.setProperty("--naviButtonSize", "var(--smallNaviButtonSize)");
        document.documentElement.style.setProperty("--fixedFooterSize", "var(--smallFixedFooterSize)");
        document.documentElement.style.setProperty("--fullFooterSize", "var(--smallFullFooterSize)");
        document.documentElement.style.setProperty("--liSize", "var(--smallLiSize)");
        console.log("lol");
    })

    //Add event listener to replace globally used colour scheme variable values with the dark mode colour values
    darkModeButton.addEventListener("click", function(event) {
        document.documentElement.style.setProperty("--primary", "var(--primaryDark)");
        document.documentElement.style.setProperty("--secondary", "var(--secondaryDark)");
        document.documentElement.style.setProperty("--grey", "var(--greyDark)");
        document.documentElement.style.setProperty("--border", "var(--borderDark)");
        document.documentElement.style.setProperty("--headingBackground", "var(--headingBackgroundDark)");
        document.documentElement.style.setProperty("--bodyBackground", "var(--bodyBackgroundDark)");
        document.documentElement.style.setProperty("--contentBackground", "var(--contentBackgroundDark)");
        document.documentElement.style.setProperty("--contentText", "var(--contentTextDark)");
        document.documentElement.style.setProperty("--contentHover", "var(--contentHoverDark)");
    });
    
    //Add event listener to replace the globally used colour scheme variable values with the light mode colour values
    lightModeButton.addEventListener("click", function(event) {
        document.documentElement.style.setProperty("--primary", "var(--primaryLight)");
        document.documentElement.style.setProperty("--secondary", "var(--secondaryLight)");
        document.documentElement.style.setProperty("--grey", "var(--greyLight)");
        document.documentElement.style.setProperty("--border", "var(--borderLight)");
        document.documentElement.style.setProperty("--headingBackground", "var(--headingBackgroundLight)");
        document.documentElement.style.setProperty("--bodyBackground", "var(--bodyBackgroundLight)");
        document.documentElement.style.setProperty("--contentBackground", "var(--contentBackgroundLight)");
        document.documentElement.style.setProperty("--contentText", "var(--contentTextLight)");
        document.documentElement.style.setProperty("--contentHover", "var(--contentHoverLight)");
    })
};

//Function that adds functionality to the Navigation bar button in the header (that is hidden unless in mobile or tablet mode)
showNavi = function() {
    //Fetch appropriate elements
    naviButton = document.getElementById("naviButton");
    naviUl = document.getElementById("naviUl");
    mainHeader = document.getElementById("mainHeader");
    naviBar = document.getElementById("naviBar");
    //Declare local variable that correlates to the default state of the navigation button to be hidden
    var showNavi = false;
    
    //Add event listener to the Navigation button that checks whether the Navigation bar is being displayed, if it is not, it will display it, if it is then it will hide it
    naviButton.addEventListener("click", function(event){
        if (showNavi == false){
            naviUl.style.display = "block";
            mainHeader.style.height = "60vh";
            naviButton.style.paddingRight = "50px";
            showNavi = true;
        }
        else if (showNavi == true){
            naviUl.style.display = "none";
            mainHeader.style.height = "20vh";
            naviButton.style.paddingRight = "0px";
            showNavi = false;
        }
    });
};

//Function that adds functionality to the Expand and Collapse buttons on the Gallery.html page.
activateGallery = function() {
    //Here I fetch the appropriate elements
    expandGallery = document.getElementById("expandGallery");
    expandLatest = document.getElementById("expandLatest");
    gallery = document.getElementById("photoGallery");
    latestContent = document.getElementById("LatestTarget");
    var showG = false;
    var showL = false
    //Here I add event listeners to the elements
    expandGallery.addEventListener("click", function(event) {
        console.log("click");
        if (showG == false){
            gallery.style.display = "block";
            expandGallery.innerHTML = "Photo Gallery<br>Tap to Collapse"
            showG = true;
        }
        else if (showG == true)
        {
            gallery.style.display = "none";
            expandGallery.innerHTML = "Photo Gallery<br>Tap to Expand"
            showG = false;
        }
    });
    
    expandLatest.addEventListener("click", function(event) {
        console.log("click");
        if (showL == false)
        {
            latestContent.style.display = "block";
            expandLatest.innerHTML = "Latest Posts<br>Tap to Collapse"
            showL = true;
        }
        else if (showL == true)
        {
            latestContent.style.display = "none";
            expandLatest.innerHTML = "Latest Posts<br>Tap to Expand"
            showL = false;
        }
    });
    
    
}
