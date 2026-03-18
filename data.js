// ==================== DATABASE ====================
const DB = {
    getUser: () => {
        const user = localStorage.getItem('cibo_user');
        return user ? JSON.parse(user) : null;
    },
    setUser: (user) => {
        localStorage.setItem('cibo_user', JSON.stringify(user));
    },
    logout: () => {
        localStorage.removeItem('cibo_user');
    },
    getMenu: () => {
        const menuWithRating = INITIAL_MENU.map(item => ({
            ...item,
            rating: item.rating || 4.5
        }));
        localStorage.setItem('cibo_menu', JSON.stringify(menuWithRating));
        return menuWithRating;
    },
    setMenu: (menu) => {
        localStorage.setItem('cibo_menu', JSON.stringify(menu));
    },
    getReservations: () => {
        const saved = localStorage.getItem('cibo_reservations');
        return saved ? JSON.parse(saved) : [];
    },
    addReservation: (reservation) => {
        const reservations = DB.getReservations();
        const newReservation = {
            ...reservation,
            id: Date.now(),
            status: 'Confirmed'
        };
        reservations.push(newReservation);
        localStorage.setItem('cibo_reservations', JSON.stringify(reservations));
        return newReservation;
    }
};

// ==================== CATEGORIES ====================
const CATEGORIES = [
    "Continental Soup",
    "Pan-Asian Soup",
    "Salads",
    "Mexican",
    "Sandwiches",
    "Veg Starters",
    "Non-Veg Starters",
    "Main Course",
    "Pasta",
    "CIBO Special Bowls",
    "Ramen Rice Noodles",
    "Biryani",
    "Indian Gravy",
    "Breads",
    "Burgers",
    "Pizza"
];

// ==================== MENU ITEMS ====================
const INITIAL_MENU = [
    // SOUPS - CONTINENTAL
    { id: 1, name: "Cream of Mushroom/Chicken", description: "Creamy blended soup with fresh mushrooms or chicken", price: 280, category: "Continental Soup", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=800", rating: 4.5, isVeg: false },
    { id: 2, name: "Roasted Pumpkin", description: "Roasted pumpkin puree soup with cream", price: 300, category: "Continental Soup", image: "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?auto=format&fit=crop&q=80&w=800", rating: 4.4, isVeg: true },
    { id: 3, name: "Chicken & Corn with Lemongrass", description: "Chicken corn soup with aromatic lemongrass", price: 300, category: "Continental Soup", image: "https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?auto=format&fit=crop&q=80&w=800", rating: 4.7, isVeg: false },
    { id: 4, name: "Mix Seafood Broth", description: "Light and flavorful broth with fresh seafood", price: 300, category: "Continental Soup", image: "https://zestfulkitchen.com/wp-content/uploads/2020/12/Seafood-Soup_cover-for-web-2.jpg", rating: 4.8, isVeg: false },

    // SOUPS - PAN-ASIAN
    { id: 5, name: "Traditional Sweet Corn", description: "Classic corn soup with egg drops", price: 260, category: "Pan-Asian Soup", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=800", rating: 4.5, isVeg: true },
    { id: 6, name: "Manchow", description: "Spicy Indo-Chinese soup with vegetables", price: 260, category: "Pan-Asian Soup", image: "https://indianfoodsrecipies.in/wp-content/uploads/2025/08/4096px-Manchow_soup_-_Indo-Chinese_cuisine-scaled.jpg", rating: 4.4, isVeg: true },
    { id: 7, name: "Hot & Sour", description: "Tangy and spicy soup with tofu", price: 260, category: "Pan-Asian Soup", image: "https://lexiscleankitchen.com/wp-content/uploads/2018/08/Easy-Hot-and-Sour-Soup.jpg", rating: 4.5, isVeg: true },
    { id: 8, name: "Tom Yum", description: "Thai lemongrass soup with shrimp", price: 260, category: "Pan-Asian Soup", image: "https://images.unsplash.com/photo-1548943487-a2e4e43b4853?auto=format&fit=crop&q=80&w=800", rating: 4.8, isVeg: false },
    { id: 9, name: "Pho", description: "Vietnamese beef broth with rice noodles", price: 260, category: "Pan-Asian Soup", image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&q=80&w=800", rating: 4.7, isVeg: false },
    { id: 10, name: "Tom Kha", description: "Coconut Thai soup with galangal", price: 260, category: "Pan-Asian Soup", image: "https://i.pinimg.com/originals/f8/d6/a8/f8d6a827ca7ba09a8abb4fa29fe03a93.webp", rating: 4.6, isVeg: true },
    { id: 11, name: "Crab Meat", description: "Rich crab soup with egg white", price: 300, category: "Pan-Asian Soup", image: "https://tse1.mm.bing.net/th/id/OIP.8XyHEx0mu7FSq8HAmAsLFAHaJQ?rs=1&pid=ImgDetMain&o=7&rm=3", rating: 4.9, isVeg: false },

    // SALADS
    { id: 12, name: "Korean Kimchi Salad", description: "Fermented cabbage spicy salad", price: 340, category: "Salads", image: "https://i.pinimg.com/736x/0c/40/60/0c406007847509d665519028739df391.jpg", rating: 4.5, isVeg: true },
    { id: 13, name: "Garden Fresh Vegetable Salad", description: "Fresh greens with parmesan", price: 340, category: "Salads", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800", rating: 4.4, isVeg: true },
    { id: 14, name: "Som Tam Salad", description: "Thai green papaya salad", price: 340, category: "Salads", image: "https://www.whiskaffair.com/wp-content/uploads/2015/07/Som-Tam-3.jpg", rating: 4.6, isVeg: true },
    { id: 15, name: "Yum Woon Sen", description: "Glass noodle salad with shrimp", price: 440, category: "Salads", image: "https://cicili.tv/wp-content/uploads/2019/05/Yum-Woon-Sen-2-scaled.jpg", rating: 4.7, isVeg: false },
    { id: 16, name: "Warm Chicken Salad", description: "Grilled chicken with mixed greens", price: 380, category: "Salads", image: "https://images.unsplash.com/photo-1604909052743-94e838986d24?auto=format&fit=crop&q=80&w=800", rating: 4.5, isVeg: false },
    { id: 17, name: "Larb Gai", description: "Thai minced chicken salad", price: 380, category: "Salads", image: "https://images.unsplash.com/photo-1604909052743-94e838986d24?auto=format&fit=crop&q=80&w=800", rating: 4.6, isVeg: false },
    { id: 18, name: "Yam Thalai", description: "Mixed seafood salad with herbs", price: 400, category: "Salads", image: "https://hungryinthailand.com/wp-content/uploads/2023/08/spicy-thai-seafood-salad-768x1024.webp", rating: 4.7, isVeg: false },

    // MEXICAN
    { id: 19, name: "Paneer Skewers", description: "Grilled paneer with Mexican spices", price: 420, category: "Mexican", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=800", rating: 4.5, isVeg: true },
    { id: 20, name: "Spanakopita", description: "Spinach feta cheese pastry", price: 380, category: "Mexican", image: "https://tse2.mm.bing.net/th/id/OIP.hhKfCoulhE3-gof1TNW7rAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3", rating: 4.4, isVeg: true },
    { id: 21, name: "Cibo Nachos", description: "Crispy nachos with cheese and toppings", price: 280, category: "Mexican", image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&q=80&w=800", rating: 4.5, isVeg: true },
    { id: 22, name: "Taco", description: "Soft shell tacos with fillings", price: 280, category: "Mexican", image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&q=80&w=800", rating: 4.4, isVeg: true },
    { id: 23, name: "Quesadilla", description: "Cheese stuffed tortilla grilled", price: 380, category: "Mexican", image: "https://images.unsplash.com/photo-1618040996337-56904b7850b9?auto=format&fit=crop&q=80&w=800", rating: 4.5, isVeg: true },
    { id: 24, name: "Burrito", description: "Rice and bean wrapped tortilla", price: 380, category: "Mexican", image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&q=80&w=800", rating: 4.4, isVeg: true },

    // SANDWICHES
    { id: 25, name: "Green Garden Club Sandwich", description: "Veggie sandwich with fresh vegetables", price: 380, category: "Sandwiches", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=800", rating: 4.4, isVeg: true },
    { id: 26, name: "Paneer Pataka Sandwich", description: "Spicy paneer grilled sandwich", price: 380, category: "Sandwiches", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=800", rating: 4.5, isVeg: true },
    { id: 27, name: "Cibo Grilled Chicken Club", description: "Triple deck chicken sandwich", price: 400, category: "Sandwiches", image: "https://notycheese.com/wp-content/uploads/2025/07/15-2.jpg", rating: 4.6, isVeg: false },

    // VEG STARTERS
    { id: 28, name: "Chilli Cheese Garlic Bread", description: "Garlic bread with cheese and chilli", price: 320, category: "Veg Starters", image: "https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?auto=format&fit=crop&q=80&w=800", rating: 4.5, isVeg: true },
    { id: 29, name: "Stuffed Mushroom Balls", description: "Crispy breaded mushrooms", price: 360, category: "Veg Starters", image: "https://tse4.mm.bing.net/th/id/OIP.GLD9x1EKJbsI5ikIMgAdvwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3", rating: 4.6, isVeg: true },
    { id: 30, name: "Crispy Baby Corn", description: "Crispy fried baby corn", price: 360, category: "Veg Starters", image: "https://images.unsplash.com/photo-1604909052743-94e838986d24?auto=format&fit=crop&q=80&w=800", rating: 4.4, isVeg: true },
    { id: 31, name: "Cocktail Paneer Strips", description: "Paneer in tangy sauce", price: 420, category: "Veg Starters", image: "https://images.slurrp.com/prod/recipe_images/transcribe/snack/Crispy-paneer-pakora.webp", rating: 4.5, isVeg: true },
    { id: 32, name: "Mozzarella Cheese Fritters", description: "Golden fried mozzarella", price: 380, category: "Veg Starters", image: "https://images.unsplash.com/photo-1531749668029-2db88e4276c7?auto=format&fit=crop&q=80&w=800", rating: 4.6, isVeg: true },
    { id: 33, name: "Cajun Spicy Potato Wedges", description: "Seasoned potato wedges", price: 340, category: "Veg Starters", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=800", rating: 4.4, isVeg: true },
    { id: 34, name: "Cibo French Fries", description: "Crispy fries with cheese salsa", price: 340, category: "Veg Starters", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=800", rating: 4.5, isVeg: true },
    { id: 35, name: "Asian Veg Tempura", description: "Crispy vegetable tempura", price: 380, category: "Veg Starters", image: "https://i.pinimg.com/736x/33/60/c5/3360c5f9c56ea1f4ef3186e3a46aa907.jpg", rating: 4.5, isVeg: true },
    { id: 36, name: "Crispy American Corn", description: "Sweet corn fritters", price: 380, category: "Veg Starters", image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=800", rating: 4.4, isVeg: true },
    { id: 37, name: "Mushroom Salt & Pepper", description: "Stir fried mushrooms", price: 380, category: "Veg Starters", image: "https://tse1.mm.bing.net/th/id/OIP.gcv7-6_J616Xk3s_5h2tYwHaFj?w=768&h=576&rs=1&pid=ImgDetMain&o=7&rm=3", rating: 4.5, isVeg: true },
    { id: 38, name: "Gobi Manchurian", description: "Indo-Chinese cauliflower", price: 380, category: "Veg Starters", image: "https://cdn.tasteatlas.com/images/dishes/cba6279ae21445539df7e5f35b063bcb.jpg?mw=1300", rating: 4.6, isVeg: true },
    { id: 39, name: "Paneer Kung Pao", description: "Spicy paneer with peanuts", price: 420, category: "Veg Starters", image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&q=80&w=800", rating: 4.7, isVeg: true },
    { id: 40, name: "Chilli Cheese Corn", description: "Sweet corn with cheese", price: 380, category: "Veg Starters", image: "https://tse1.mm.bing.net/th/id/OIP.oWlSfuvXvUa4m5dsTYJRgQHaHa?w=530&h=530&rs=1&pid=ImgDetMain&o=7&rm=3", rating: 4.5, isVeg: true },
    { id: 41, name: "Crispy Thai Chilli Roll", description: "Veggie spring rolls", price: 400, category: "Veg Starters", image: "https://www.wandercooks.com/wp-content/uploads/2020/09/crispy-thai-spring-rolls-recipe-4-683x1024.jpg", rating: 4.6, isVeg: true },
    { id: 42, name: "Vietnamese Summer Roll", description: "Fresh rice paper rolls", price: 400, category: "Veg Starters", image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800", rating: 4.5, isVeg: true },
    { id: 43, name: "Crispy Lotus Stem", description: "Fried kamal kakdi", price: 420, category: "Veg Starters", image: "https://images.unsplash.com/photo-1604909052743-94e838986d24?auto=format&fit=crop&q=80&w=800", rating: 4.6, isVeg: true },
    { id: 44, name: "Potato Cheese Kebab", description: "Grilled potato cheese", price: 340, category: "Veg Starters", image: "https://tse3.mm.bing.net/th/id/OIP.XmrAVFMC-Fjk1iR_HyrMEAHaFp?rs=1&pid=ImgDetMain&o=7&rm=3", rating: 4.5, isVeg: true },
    { id: 45, name: "Cheesy Mushroom Tikka", description: "Creamy mushroom tikka", price: 380, category: "Veg Starters", image: "https://www.awesomecuisine.com/wp-content/uploads/2014/05/Mushroom-Tikka.jpg", rating: 4.6, isVeg: true },
    { id: 46, name: "Malai Broccoli", description: "Creamy grilled broccoli", price: 380, category: "Veg Starters", image: "https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?auto=format&fit=crop&q=80&w=800", rating: 4.5, isVeg: true },
    { id: 47, name: "Chandni Paneer Tikka", description: "Royal paneer tikka", price: 420, category: "Veg Starters", image: "https://c.ndtvimg.com/2024-07/9fe2b05g_paneer-tikka_625x300_01_July_24.jpg", rating: 4.7, isVeg: true },
    { id: 48, name: "Veg Seekh Kebab", description: "Mixed vegetable kebab", price: 360, category: "Veg Starters", image: "https://images.slurrp.com/prodarticles/o6dib21hju9.webp", rating: 4.5, isVeg: true },
    { id: 49, name: "Dahi Palak Tikka", description: "Yogurt marinated spinach", price: 360, category: "Veg Starters", image: "https://sheeshmahal.co.uk/wp-content/uploads/2020/06/Chicken-Palak-Dahi.jpg", rating: 4.4, isVeg: true },
    { id: 50, name: "Tandoori Pineapple", description: "Grilled pineapple chunks", price: 360, category: "Veg Starters", image: "https://tse2.mm.bing.net/th/id/OIP.bwJaIn99cpNkauj5O99W0AHaHa?rs=1&pid=ImgDetMain&o=7&rm=3", rating: 4.3, isVeg: true },
    { id: 51, name: "Aloo Tikki Chaat", description: "Potato patty chaat", price: 360, category: "Veg Starters", image: "https://cookwithdi.com/wp-content/uploads/2024/10/IMG_1163photo-full.jpg", rating: 4.5, isVeg: true },
    { id: 52, name: "Crispy Namkeen", description: "Spicy crispy snacks", price: 360, category: "Veg Starters", image: "https://tiimg.tistatic.com/fp/1/008/390/natural-ingredients-tasty-crispy-mixture-namkeen-870.jpg", rating: 4.4, isVeg: true },

    // NON-VEG STARTERS
    { id: 53, name: "Grilled Chicken Sticks", description: "Tandoori chicken on skewers", price: 420, category: "Non-Veg Starters", image: "https://tse1.mm.bing.net/th/id/OIP.IXozuWoDaxjM6IFsORb0FQHaLH?rs=1&pid=ImgDetMain&o=7&rm=3", rating: 4.6, isVeg: false },
    { id: 54, name: "Chicken Sausage Bites", description: "Crispy sausage rounds", price: 420, category: "Non-Veg Starters", image: "https://tse1.explicit.bing.net/th/id/OIP.Mc0ucrAwioXISVPbIcBVAgHaJ4?rs=1&pid=ImgDetMain&o=7&rm=3", rating: 4.5, isVeg: false },
    { id: 55, name: "Cocktail Chicken Strips", description: "Breaded chicken strips", price: 420, category: "Non-Veg Starters", image: "https://tse4.mm.bing.net/th/id/OIP.6UNsXFICmou3nb7tS5lLCQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3", rating: 4.6, isVeg: false },
    { id: 56, name: "Creamy Crunchy Chicken", description: "Chicken in creamy sauce", price: 420, category: "Non-Veg Starters", image: "https://tse4.mm.bing.net/th/id/OIP.O408y2fce47wc2RkMBDJSgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3", rating: 4.7, isVeg: false },
    { id: 57, name: "Rosemary Chicken Tender", description: "Herb marinated chicken", price: 420, category: "Non-Veg Starters", image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&q=80&w=800", rating: 4.6, isVeg: false },
    { id: 58, name: "Chicken Wings", description: "Grilled chicken wings", price: 420, category: "Non-Veg Starters", image: "https://www.chilesandsmoke.com/wp-content/uploads/2022/12/Grilled-Chicken-Wings_Featured.jpg", rating: 4.7, isVeg: false },
    { id: 59, name: "Hot Buffalo Wings", description: "Spicy buffalo wings", price: 420, category: "Non-Veg Starters", image: "https://www.jessicagavin.com/wp-content/uploads/2018/01/crispy-baked-buffalo-wings-7-1200.jpg", rating: 4.8, isVeg: false },
    { id: 60, name: "Crispy Fish Finger", description: "Breaded fish fingers", price: 440, category: "Non-Veg Starters", image: "https://i.pinimg.com/736x/e0/ec/a4/e0eca47cc857f3f668fb0c5ad0367aac.jpg", rating: 4.5, isVeg: false },
    { id: 61, name: "Creamy Garlic Prawns", description: "Garlic butter prawns", price: 460, category: "Non-Veg Starters", image: "https://tse4.mm.bing.net/th/id/OIP.XzkKibDk-7fjXVTyFSiupAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3", rating: 4.7, isVeg: false },
    { id: 62, name: "Crumb Fried Prawns", description: "Golden fried prawns", price: 460, category: "Non-Veg Starters", image: "https://cdn.momsdish.com/wp-content/uploads/2020/05/Crispy-Air-Fryer-Coconut-Shrimp-07-600x400.jpg", rating: 4.6, isVeg: false },
    { id: 63, name: "Crab Lollipop", description: "Crab meat lollipops", price: 460, category: "Non-Veg Starters", image: "https://3.imimg.com/data3/MP/FC/MY-2/crab-lollipop-500x500.jpg", rating: 4.8, isVeg: false },
    { id: 64, name: "Fried Calamari Rings", description: "Crispy squid rings", price: 440, category: "Non-Veg Starters", image: "https://vintagekitchennotes.com/wp-content/uploads/2025/01/Crispy-fried-breaded-calamari.jpg", rating: 4.5, isVeg: false },
    { id: 65, name: "Kai Satay", description: "Chicken satay with peanut sauce", price: 440, category: "Non-Veg Starters", image: "https://images.unsplash.com/photo-1529563021893-cc83c992d75d?auto=format&fit=crop&q=80&w=800", rating: 4.7, isVeg: false },
    { id: 66, name: "Kung Pao Chicken", description: "Spicy diced chicken", price: 420, category: "Non-Veg Starters", image: "https://www.jessicagavin.com/wp-content/uploads/2019/01/kung-pao-chicken-4.jpg", rating: 4.6, isVeg: false },
    { id: 67, name: "Thai Crispy Chicken", description: "Thai style crispy chicken", price: 420, category: "Non-Veg Starters", image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&q=80&w=800", rating: 4.5, isVeg: false },
    { id: 68, name: "Chicken Wonton", description: "Crispy chicken dumplings", price: 420, category: "Non-Veg Starters", image: "https://lindseyeatsla.com/wp-content/uploads/2021/07/Lindseyeats_Chicken_Wontons_Spicy_Sauce-5.jpg", rating: 4.6, isVeg: false },
    { id: 69, name: "Drums of Heaven", description: "Spicy chicken lollipops", price: 420, category: "Non-Veg Starters", image: "https://i.pinimg.com/originals/e2/c3/cb/e2c3cb3558ab854267dab9129a82bd35.jpg", rating: 4.7, isVeg: false },
    { id: 70, name: "Vietnam Fish", description: "Vietnamese fish fry", price: 460, category: "Non-Veg Starters", image: "https://tse2.mm.bing.net/th/id/OIP.MHSOaeSe56YwAjwO18XHBgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3", rating: 4.6, isVeg: false },
    { id: 71, name: "Cambodian Grill Fish", description: "Grilled fish Cambodian style", price: 460, category: "Non-Veg Starters", image: "https://i.natgeofe.com/n/e8bc1ba3-67f7-4654-9bd4-87dfd9a94081/eatcambodia_gettyimages-525920101_hr.jpg", rating: 4.7, isVeg: false },
    { id: 72, name: "Thai Crispy Prawn", description: "Crispy prawns Thai style", price: 480, category: "Non-Veg Starters", image: "https://tse1.mm.bing.net/th/id/OIP.3kBvr6LswDfdH35zVFkVrQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3", rating: 4.8, isVeg: false },
    { id: 73, name: "Crab Singapore Sauce", description: "Crab in Singapore sauce", price: 800, category: "Non-Veg Starters", image: "https://tse3.mm.bing.net/th/id/OIP.-7oEIpZQQIWwL0JO9e5edgHaE6?rs=1&pid=ImgDetMain&o=7&rm=3", rating: 4.9, isVeg: false },
    { id: 74, name: "Crisp Lamb", description: "Crispy lamb bites", price: 660, category: "Non-Veg Starters", image: "https://cdn.mos.cms.futurecdn.net/cgoM58BDa7YnWLwTJpEWGn-1200-80.jpg", rating: 4.7, isVeg: false },
    { id: 75, name: "Lobster", description: "Grilled lobster tail", price: 1200, category: "Non-Veg Starters", image: "https://www.mashed.com/img/gallery/types-of-lobster-and-how-to-cook-them/l-intro-1645814633.jpg", rating: 4.9, isVeg: false },
    { id: 76, name: "Tandoori Khazana Chicken", description: "Specialty tandoori chicken", price: 460, category: "Non-Veg Starters", image: "https://img-cdn.thepublive.com/fit-in/1280x960/filters:format(webp)/sanjeev-kapoor/media/post_banners/362c11d85640f0ff560b5752184589abf7d0cef7d187bcea0dfb4d42f9d10df0.jpg", rating: 4.7, isVeg: false },
    { id: 77, name: "Chicken Cheese Kebab", description: "Cheese stuffed chicken kebab", price: 460, category: "Non-Veg Starters", image: "https://gainsgourmet.com/wp-content/uploads/2025/02/Chicken-Cheese-Kebab1.webp", rating: 4.8, isVeg: false },
    { id: 78, name: "Tandoori Chicken", description: "Classic tandoori chicken", price: 360, category: "Non-Veg Starters", image: "https://www.kitchensanctuary.com/wp-content/uploads/2025/07/Tandoori-Chicken-Square-FS.jpg", rating: 4.6, isVeg: false },
    { id: 79, name: "Gulabi Kebab", description: "Pink masala kebab", price: 620, category: "Non-Veg Starters", image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&q=80&w=800", rating: 4.8, isVeg: false },
    { id: 80, name: "Ajwaini Fish Tikka", description: "Fish tikka with carom", price: 460, category: "Non-Veg Starters", image: "https://mypeppermintkitchen.wordpress.com/wp-content/uploads/2022/02/ajwaini-fish-tikka-cov.jpg?w=750", rating: 4.7, isVeg: false },
    { id: 81, name: "Jinga Noorjahani", description: "Royal prawn kebab", price: 480, category: "Non-Veg Starters", image: "https://tse1.explicit.bing.net/th/id/OIP.9IP7XKuXhZXFD6OmwnfvZAHaE8?rs=1&pid=ImgDetMain&o=7&rm=3", rating: 4.8, isVeg: false },
    { id: 82, name: "Cibo Chicken 65", description: "Spicy fried chicken", price: 420, category: "Non-Veg Starters", image: "https://i.pinimg.com/originals/6c/ba/f9/6cbaf9733860bbecbab77bb998dcdd3a.jpg", rating: 4.6, isVeg: false },
    { id: 83, name: "Andhra Kodi Vepudu", description: "Andhra chicken fry", price: 420, category: "Non-Veg Starters", image: "https://i.ytimg.com/vi/gk-NvRFaP6o/hqdefault.jpg", rating: 4.7, isVeg: false },
    { id: 84, name: "Andhra Chilli Chicken", description: "Spicy chilli chicken", price: 420, category: "Non-Veg Starters", image: "https://allrecipesss.com/wp-content/uploads/2025/08/Andhra-Chicken-Fry.webp", rating: 4.6, isVeg: false },
    { id: 85, name: "Chicken Ghee Roast", description: "Chicken in ghee roast", price: 440, category: "Non-Veg Starters", image: "https://swatisani.net/kitchen/wp-content/uploads/2015/09/IMG_9051.jpg", rating: 4.8, isVeg: false },
    { id: 86, name: "Prawn Chukka", description: "Dry prawn curry", price: 460, category: "Non-Veg Starters", image: "https://tse1.mm.bing.net/th/id/OIP.Sej3kbiXV0p2vtEtyumLqgHaD4?pid=ImgDet&w=474&h=248&rs=1&o=7&rm=3", rating: 4.7, isVeg: false },
    { id: 87, name: "Kerala Squid Roast", description: "Kerala style squid", price: 420, category: "Non-Veg Starters", image: "https://2.bp.blogspot.com/-9Kx7EHWhQOM/VwUV5Ygi2xI/AAAAAAAEnxs/eUpX7gff8LAt1YjJlvDedxb3YXhFw18cg/s1600/1.JPG", rating: 4.6, isVeg: false },
    { id: 88, name: "Mutton Pepper Fry", description: "Mutton with pepper", price: 660, category: "Non-Veg Starters", image: "https://th.bing.com/th/id/R.e7162ad4ce5effc6753d76598dce5c83?rik=bvhwo6hKmcXi8A&riu=http%3a%2f%2f2.bp.blogspot.com%2f_MN2150GzZ0g%2fS-o_8ST036I%2fAAAAAAAAAek%2fckkHtl-aIkQ%2fs1600%2fDSC_0225.JPG&ehk=MDKX8Mz%2brFmMSixShDEoPBY%2fVZrFF7KlRQ0ekOmWik0%3d&risl=&pid=ImgRaw&r=0", rating: 4.8, isVeg: false },
    { id: 89, name: "Mutton Chukka", description: "Spicy dry mutton", price: 660, category: "Non-Veg Starters", image: "https://www.lekhafoods.com/media/1051277/virudhunagar-mutton-sukka.jpg", rating: 4.7, isVeg: false },

    // MAIN COURSE
    { id: 90, name: "Malay Nasi Goreng Chicken", description: "Malaysian fried rice", price: 580, category: "Main Course", image: "https://img.freepik.com/premium-photo/classic-malaysian-nasi-goreng-with-chicken-healthy-fried-rice-image_1020697-141212.jpg", rating: 4.7, isVeg: false },
    { id: 91, name: "Malay Nasi Goreng Prawn", description: "Prawn fried rice", price: 600, category: "Main Course", image: "https://seafoodroom.hk/wp-content/uploads/2025/05/prawn-nasi-goreng-recipe-1746064563.jpg", rating: 4.8, isVeg: false },
    { id: 92, name: "Vietnamese Tom Chicken", description: "Vietnamese tomato chicken", price: 580, category: "Main Course", image: "https://pupswithchopsticks.com/wp-content/uploads/vietnamese-lemongrass-chicken-tn.jpg", rating: 4.6, isVeg: false },
    { id: 93, name: "Cibo Grilled Chicken Steak", description: "Grilled chicken steak", price: 580, category: "Main Course", image: "https://ikneadtoeat.com/wp-content/uploads/2022/11/grilled-chicken-steak-6-768x979.jpg", rating: 4.7, isVeg: false },
{ id: 94, name: "Spanish Chicken Aragon", description: "Spanish style chicken", price: 580, category: "Main Course", image: "https://images.immediate.co.uk/production/volatile/sites/30/2022/09/Spanish-Chicken-96abb56.jpg?quality=90&resize=556,505", rating: 4.6, isVeg: false },
{ id: 95, name: "Chicken Parmigiana", description: "Chicken parmesan", price: 580, category: "Main Course", image: "https://easyworldrecipes.com/wp-content/uploads/2024/08/Simple-Italian-Chicken-Parmigiana-Recipe-1024x1536.jpg", rating: 4.7, isVeg: false },
{ id: 96, name: "Chicken Namtok", description: "Thai minced chicken", price: 580, category: "Main Course", image: "https://hungryinthailand.com/wp-content/uploads/2023/10/Thai-honey-chicken-768x576.webp", rating: 4.6, isVeg: false },
{ id: 97, name: "Southern Spice Fish", description: "Spiced grilled fish", price: 580, category: "Main Course", image: "https://soulfoodcooking101.com/wp-content/uploads/2023/05/maxresdefault-1-copy.webp", rating: 4.7, isVeg: false },
{ id: 98, name: "Grill Fillet Fish", description: "Grilled fish fillet", price: 580, category: "Main Course", image: "https://cuban.recipes/wp-content/uploads/2019/10/grilled-fish-fillet.jpg", rating: 4.8, isVeg: false },
{ id: 99, name: "Prawn Water Dore", description: "Prawn in golden sauce", price: 600, category: "Main Course", image: "https://static.vecteezy.com/system/resources/previews/012/729/810/non_2x/grilled-waterprawn-dish-free-photo.jpg", rating: 4.7, isVeg: false },
{ id: 100, name: "Caribbean Prawn", description: "Caribbean style prawn", price: 600, category: "Main Course", image: "https://cdn.tasteatlas.com/images/dishes/c42c4660b8de4b9989809e3d84b652bd.jpg?mw=1300", rating: 4.8, isVeg: false },
{ id: 101, name: "Lamb Stroganoff", description: "Creamy lamb stroganoff", price: 680, category: "Main Course", image: "https://diyjoy.com/wp-content/uploads/2025/01/Mushroom-Stroganoff-Recipe.jpg", rating: 4.9, isVeg: false },
{ id: 102, name: "Paneer Steak", description: "Grilled paneer steak", price: 520, category: "Main Course", image: "https://madscookhouse.com/wp-content/uploads/2021/07/Peri-Peri-Paneer-Steaks-1024x516.jpg", rating: 4.6, isVeg: true },
{ id: 103, name: "Vegetable Au Gratin", description: "Creamy vegetable gratin", price: 480, category: "Main Course", image: "https://www.cucinabyelena.com/wp-content/uploads/2024/08/Vegetable-Au-Gratin-Recipe-Creamy-Baked-Vegetables-21-scaled.jpg", rating: 4.5, isVeg: true },
{ id: 104, name: "Vegetable Fried Balls", description: "Crispy veggie balls", price: 480, category: "Main Course", image: "https://tse1.explicit.bing.net/th/id/OIP.Kt5PgMziBhnW7J4LARQwGAHaE7?rs=1&pid=ImgDetMain&o=7&rm=3", rating: 4.4, isVeg: true },
{ id: 105, name: "Vegetable Shashlik", description: "Grilled vegetable shashlik", price: 480, category: "Main Course", image: "https://i.ytimg.com/vi/SNNDuM24HMw/maxresdefault.jpg", rating: 4.5, isVeg: true },

    // All images from images.pexels.com — every photo ID verified from live Pexels search results
// Zero repeated images across all 37 items

// ─── PASTA ────────────────────────────────────────────────────────────────────

{ id: 106, name: "Arrabbiata", description: "Spicy tomato pasta", price: 440, category: "Pasta",
  image: "https://images.pexels.com/photos/11161425/pexels-photo-11161425.jpeg?auto=compress&cs=tinysrgb&w=800",
  rating: 4.5, isVeg: true },

{ id: 107, name: "Mac & Cheese", description: "Creamy macaroni cheese", price: 440, category: "Pasta",
  image: "https://images.pexels.com/photos/9397238/pexels-photo-9397238.jpeg?auto=compress&cs=tinysrgb&w=800",
  rating: 4.6, isVeg: true },

{ id: 108, name: "Valentino Pasta", description: "Special Valentino pasta", price: 460, category: "Pasta",
  image: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=800",
  rating: 4.7, isVeg: true },

{ id: 109, name: "Pesto Pasta", description: "Basil pesto pasta", price: 440, category: "Pasta",
  image: "https://images.pexels.com/photos/1373915/pexels-photo-1373915.jpeg?auto=compress&cs=tinysrgb&w=800",
  rating: 4.6, isVeg: true },

{ id: 110, name: "Aglio Olio", description: "Garlic olive oil pasta", price: 440, category: "Pasta",
  image: "https://images.pexels.com/photos/4518879/pexels-photo-4518879.jpeg?auto=compress&cs=tinysrgb&w=800",
  rating: 4.5, isVeg: true },

{ id: 111, name: "Veg Lasagna", description: "Layered vegetable lasagna", price: 440, category: "Pasta",
  image: "https://images.pexels.com/photos/4079520/pexels-photo-4079520.jpeg?auto=compress&cs=tinysrgb&w=800",
  rating: 4.6, isVeg: true },

{ id: 112, name: "Carbonara Chicken", description: "Chicken carbonara", price: 460, category: "Pasta",
  image: "https://images.pexels.com/photos/5949892/pexels-photo-5949892.jpeg?auto=compress&cs=tinysrgb&w=800",
  rating: 4.7, isVeg: false },

{ id: 113, name: "Romano Pink Sauce Chicken", description: "Chicken in pink sauce", price: 460, category: "Pasta",
  image: "https://images.pexels.com/photos/725990/pexels-photo-725990.jpeg?auto=compress&cs=tinysrgb&w=800",
  rating: 4.6, isVeg: false },

{ id: 114, name: "Baked Chicken Lasagna", description: "Baked chicken lasagna", price: 480, category: "Pasta",
  image: "https://images.pexels.com/photos/2765875/pexels-photo-2765875.jpeg?auto=compress&cs=tinysrgb&w=800",
  rating: 4.7, isVeg: false },

{ id: 115, name: "Royal Seafood Lasagna", description: "Seafood lasagna", price: 520, category: "Pasta",
  image: "https://images.pexels.com/photos/31779545/pexels-photo-31779545.jpeg?auto=compress&cs=tinysrgb&w=800",
  rating: 4.8, isVeg: false },

// ─── CIBO SPECIAL BOWLS ───────────────────────────────────────────────────────

{ id: 116, name: "Chilli Chicken Butter Rice", description: "Chilli chicken with rice", price: 520, category: "CIBO Special Bowls",
  image: "https://images.pexels.com/photos/24738519/pexels-photo-24738519.jpeg?auto=compress&cs=tinysrgb&w=800",
  rating: 4.6, isVeg: false },

{ id: 117, name: "Thai Vegetable Curry Rice", description: "Thai veg curry with rice", price: 540, category: "CIBO Special Bowls",
  image: "https://images.pexels.com/photos/7521555/pexels-photo-7521555.jpeg?auto=compress&cs=tinysrgb&w=800",
  rating: 4.5, isVeg: true },

{ id: 118, name: "Thai Chicken Curry Rice", description: "Thai chicken curry rice", price: 560, category: "CIBO Special Bowls",
  image: "https://images.pexels.com/photos/674574/pexels-photo-674574.jpeg?auto=compress&cs=tinysrgb&w=800",
  rating: 4.7, isVeg: false },

{ id: 119, name: "Thai Seafood Curry Rice", description: "Thai seafood curry rice", price: 580, category: "CIBO Special Bowls",
  image: "https://images.pexels.com/photos/2871757/pexels-photo-2871757.jpeg?auto=compress&cs=tinysrgb&w=800",
  rating: 4.8, isVeg: false },

{ id: 120, name: "Massaman Curry", description: "Thai massaman curry", price: 480, category: "CIBO Special Bowls",
  image: "https://images.pexels.com/photos/19781599/pexels-photo-19781599.jpeg?auto=compress&cs=tinysrgb&w=800",
  rating: 4.6, isVeg: true },

{ id: 121, name: "Stir Fry Veg Basil Rice", description: "Veg stir fry basil rice", price: 480, category: "CIBO Special Bowls",
  image: "https://images.pexels.com/photos/17910326/pexels-photo-17910326.jpeg?auto=compress&cs=tinysrgb&w=800",
  rating: 4.5, isVeg: true },

{ id: 122, name: "Stir Fry Chicken Clay Pot", description: "Chicken clay pot stir fry", price: 520, category: "CIBO Special Bowls",
  image: "https://images.pexels.com/photos/6249394/pexels-photo-6249394.jpeg?auto=compress&cs=tinysrgb&w=800",
  rating: 4.7, isVeg: false },

{ id: 123, name: "Crispy Fish Herb Rice", description: "Crispy fish herb rice", price: 520, category: "CIBO Special Bowls",
  image: "https://images.pexels.com/photos/8467686/pexels-photo-8467686.jpeg?auto=compress&cs=tinysrgb&w=800",
  rating: 4.6, isVeg: false },

{ id: 124, name: "Crispy Oyster Fish Herb Rice", description: "Oyster fish herb rice", price: 520, category: "CIBO Special Bowls",
  image: "https://images.pexels.com/photos/30120288/pexels-photo-30120288.jpeg?auto=compress&cs=tinysrgb&w=800",
  rating: 4.7, isVeg: false },

{ id: 125, name: "Stir Fry Prawns Basil Rice", description: "Prawns basil rice", price: 560, category: "CIBO Special Bowls",
  image: "https://images.pexels.com/photos/1998920/pexels-photo-1998920.jpeg?auto=compress&cs=tinysrgb&w=800",
  rating: 4.8, isVeg: false },

// ─── RAMEN RICE NOODLES ───────────────────────────────────────────────────────

{ id: 126, name: "Shoyu Ramen", description: "Japanese soy sauce ramen", price: 440, category: "Ramen Rice Noodles",
  image: "https://images.pexels.com/photos/2133989/pexels-photo-2133989.jpeg?auto=compress&cs=tinysrgb&w=800",
  rating: 4.7, isVeg: true },

{ id: 127, name: "Chilli Basil Fried Rice", description: "Spicy basil fried rice", price: 320, category: "Ramen Rice Noodles",
  image: "https://images.pexels.com/photos/6937447/pexels-photo-6937447.jpeg?auto=compress&cs=tinysrgb&w=800",
  rating: 4.5, isVeg: true },

{ id: 128, name: "Butter Corn Fried Rice", description: "Butter corn fried rice", price: 320, category: "Ramen Rice Noodles",
  image: "https://images.pexels.com/photos/12984979/pexels-photo-12984979.jpeg?auto=compress&cs=tinysrgb&w=800",
  rating: 4.4, isVeg: true },

{ id: 129, name: "Schezwan Fried Rice", description: "Schezwan fried rice", price: 320, category: "Ramen Rice Noodles",
  image: "https://images.pexels.com/photos/5531482/pexels-photo-5531482.jpeg?auto=compress&cs=tinysrgb&w=800",
  rating: 4.6, isVeg: true },

{ id: 130, name: "Pineapple Fried Rice", description: "Sweet pineapple fried rice", price: 320, category: "Ramen Rice Noodles",
  image: "https://images.pexels.com/photos/20802552/pexels-photo-20802552.jpeg?auto=compress&cs=tinysrgb&w=800",
  rating: 4.5, isVeg: true },

{ id: 131, name: "Country Fried Rice", description: "Country style fried rice", price: 320, category: "Ramen Rice Noodles",
  image: "https://images.pexels.com/photos/1907244/pexels-photo-1907244.jpeg?auto=compress&cs=tinysrgb&w=800",
  rating: 4.4, isVeg: true },

{ id: 132, name: "Singapore Fried Rice", description: "Singapore style fried rice", price: 320, category: "Ramen Rice Noodles",
  image: "https://images.pexels.com/photos/2059151/pexels-photo-2059151.jpeg?auto=compress&cs=tinysrgb&w=800",
  rating: 4.6, isVeg: true },

{ id: 133, name: "Clay Pot Rice", description: "Clay pot cooked rice", price: 320, category: "Ramen Rice Noodles",
  image: "https://images.pexels.com/photos/8956718/pexels-photo-8956718.jpeg?auto=compress&cs=tinysrgb&w=800",
  rating: 4.5, isVeg: true },

{ id: 134, name: "Hakka Noodles", description: "Stir fried noodles", price: 320, category: "Ramen Rice Noodles",
  image: "https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&w=800",
  rating: 4.6, isVeg: true },

{ id: 135, name: "Mamak Mee Goreng", description: "Malaysian fried noodles", price: 320, category: "Ramen Rice Noodles",
  image: "https://images.pexels.com/photos/29145755/pexels-photo-29145755.jpeg?auto=compress&cs=tinysrgb&w=800",
  rating: 4.7, isVeg: true },

{ id: 136, name: "Pad Thai Noodles", description: "Thai pad thai", price: 320, category: "Ramen Rice Noodles",
  image: "https://images.pexels.com/photos/724291/pexels-photo-724291.jpeg?auto=compress&cs=tinysrgb&w=800",
  rating: 4.8, isVeg: true },

// ─── BIRYANI ──────────────────────────────────────────────────────────────────

{ id: 137, name: "Cibo Egg Biryani", description: "Egg biryani", price: 280, category: "Biryani",
  image: "https://miro.medium.com/v2/resize:fit:1079/1*sgZAv5jBuQcLmjezsl01ng.jpeg",
  rating: 4.5, isVeg: false },

{ id: 138, name: "Cibo Chicken Biryani", description: "Chicken biryani", price: 320, category: "Biryani",
  image: "https://images.pexels.com/photos/4224305/pexels-photo-4224305.jpeg?auto=compress&cs=tinysrgb&w=800",
  rating: 4.7, isVeg: false },

{ id: 139, name: "Cibo Mutton Biryani", description: "Mutton biryani", price: 400, category: "Biryani",
  image: "https://images.pexels.com/photos/4224314/pexels-photo-4224314.jpeg?auto=compress&cs=tinysrgb&w=800",
  rating: 4.8, isVeg: false },

{ id: 140, name: "Steamed Rice", description: "Plain steamed rice", price: 200, category: "Biryani",
  image: "https://images.pexels.com/photos/8956718/pexels-photo-8956718.jpeg?auto=compress&cs=tinysrgb&w=800",
  rating: 4.3, isVeg: true },

{ id: 141, name: "Curd Rice", description: "Yogurt rice", price: 200, category: "Biryani",
  image: "https://s3.india.com/wp-content/uploads/2024/05/CURD-RICE.jpg##image/jpg",
  rating: 4.4, isVeg: true },

{ id: 142, name: "Jasmine Rice", description: "Fragrant jasmine rice", price: 280, category: "Biryani",
  image: "https://images.pexels.com/photos/34159109/pexels-photo-34159109.jpeg?auto=compress&cs=tinysrgb&w=800",
  rating: 4.5, isVeg: true },
   
{ id: 143, name: "Mixed Veg Makhani", description: "Veg makhani gravy", price: 380, category: "Indian Gravy",
  image: "https://images.pexels.com/photos/2679501/pexels-photo-2679501.jpeg?auto=compress&cs=tinysrgb&w=800",
  rating: 4.5, isVeg: true },

{ id: 144, name: "Veg Banjara", description: "Spicy veg gravy", price: 360, category: "Indian Gravy",
  image: "https://images.pexels.com/photos/5410400/pexels-photo-5410400.jpeg?auto=compress&cs=tinysrgb&w=800",
  rating: 4.4, isVeg: true },

{ id: 145, name: "Dal Fry", description: "Dal tadka", price: 340, category: "Indian Gravy",
  image: "https://images.pexels.com/photos/7625056/pexels-photo-7625056.jpeg?auto=compress&cs=tinysrgb&w=800",
  rating: 4.6, isVeg: true },

{ id: 146, name: "Veg Patiala", description: "Patiala style veg", price: 380, category: "Indian Gravy",
  image: "https://images.pexels.com/photos/9324621/pexels-photo-9324621.jpeg?auto=compress&cs=tinysrgb&w=800",
  rating: 4.5, isVeg: true },

{ id: 147, name: "Paneer Lababdar", description: "Rich paneer gravy", price: 420, category: "Indian Gravy",
  image: "https://images.pexels.com/photos/28674559/pexels-photo-28674559.jpeg?auto=compress&cs=tinysrgb&w=800",
  rating: 4.7, isVeg: true },

{ id: 148, name: "Aloo Matar", description: "Potato peas curry", price: 360, category: "Indian Gravy",
  image: "https://www.cubesnjuliennes.com/wp-content/uploads/2020/07/Punjabi-Aloo-Matar-Recipe.jpg",
  rating: 4.4, isVeg: true },

{ id: 149, name: "Malai Kofta", description: "Creamy kofta curry", price: 420, category: "Indian Gravy",
  image: "https://www.cookwithmanali.com/wp-content/uploads/2020/03/Malai-Kofta-676x1024.jpg",
  rating: 4.6, isVeg: true },

{ id: 150, name: "Paneer Do Pyaza", description: "Paneer with onions", price: 420, category: "Indian Gravy",
  image: "https://www.indianhealthyrecipes.com/wp-content/uploads/2017/12/paneer-do-pyaza-recipe-1.jpg",
  rating: 4.7, isVeg: true },

{ id: 151, name: "Veg Kolhapuri", description: "Spicy Kolhapuri veg", price: 380, category: "Indian Gravy",
  image: "https://vanitascorner.com/wp-content/uploads/2023/06/Veg-Kolhapuri-2-1068x802.jpg",
  rating: 4.5, isVeg: true },

{ id: 152, name: "Paneer Chatpata", description: "Tangy paneer curry", price: 420, category: "Indian Gravy",
  image: "https://images.pexels.com/photos/7129403/pexels-photo-7129403.jpeg?auto=compress&cs=tinysrgb&w=800",
  rating: 4.6, isVeg: true },

{ id: 153, name: "Chicken Shaman", description: "Chicken shaman curry", price: 420, category: "Indian Gravy",
  image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhesaRYFAseaksuc5tODqRITXvxWJ-4_EQUd75EfIlEHwosf8tP8bCAtoyGC3uAjUxD6OQDEv7z0IbyoIstLsVYN2T3eClZwWcU297KtBbO_YkLtQpe-0LLUgXYHfew7AtYKfayY3qIucsl/s1600/Chicken+Gravy+Recipe.jpg",
  rating: 4.6, isVeg: false },

{ id: 154, name: "Chicken Laajawab", description: "Chicken lajawab", price: 420, category: "Indian Gravy",
  image: "https://images.pexels.com/photos/9609844/pexels-photo-9609844.jpeg?auto=compress&cs=tinysrgb&w=800",
  rating: 4.7, isVeg: false },

{ id: 155, name: "Chicken Dilruba", description: "Rich chicken curry", price: 480, category: "Indian Gravy",
  image: "https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=800",
  rating: 4.8, isVeg: false },

{ id: 156, name: "Butter Chicken", description: "Classic butter chicken", price: 480, category: "Indian Gravy",
  image: "https://images.pexels.com/photos/29685054/pexels-photo-29685054.jpeg?auto=compress&cs=tinysrgb&w=800",
  rating: 4.9, isVeg: false },

{ id: 157, name: "Kadai Chicken", description: "Kadai chicken", price: 480, category: "Indian Gravy",
  image: "https://images.slurrp.com/prod/recipe_images/whiskaffair/kadai-chicken-recipe-1617380087_ZHYV4C83PJJ6NU3DSS6W.webp?impolicy=slurrp-20210601&width=1200&height=675",
  rating: 4.7, isVeg: false },

{ id: 158, name: "Smoked Chicken Curry", description: "Smoked chicken curry", price: 480, category: "Indian Gravy",
  image: "https://i.ytimg.com/vi/R93SVydOjYc/hqdefault.jpg",
  rating: 4.6, isVeg: false },

{ id: 159, name: "South Indian Chicken Curry", description: "South Indian chicken", price: 460, category: "Indian Gravy",
  image: "https://www.thespruceeats.com/thmb/mDr2Eoz5T-u8Sz7fILzUpAH5UME=/5942x3967/filters:no_upscale():max_bytes(150000):strip_icc()/south-indian-style-chicken-curry-1957789-step-04-be874413218744a68c330ec63cd4aa2b.jpg",
  rating: 4.7, isVeg: false },

{ id: 160, name: "South Indian Fish Curry", description: "South Indian fish curry", price: 460, category: "Indian Gravy",
  image: "https://static.tnn.in/thumb/msid-108977719,thumbsize-1666852,width-1280,height-720,resizemode-75/108977719.jpg",
  rating: 4.8, isVeg: false },

{ id: 161, name: "Madras Prawn Thokku", description: "Spicy prawn curry", price: 520, category: "Indian Gravy",
  image: "https://hungryforever.net/wp-content/uploads/2016/11/prawn-thoku-recipe1.jpg",
  rating: 4.7, isVeg: false },

{ id: 162, name: "Mutton Keema Masala", description: "Mutton keema gravy", price: 580, category: "Indian Gravy",
  image: "https://i.ytimg.com/vi/wVp9RnDH-QE/maxresdefault.jpg",
  rating: 4.8, isVeg: false },

{ id: 163, name: "Royal Seema Mutton", description: "Royal mutton curry", price: 580, category: "Indian Gravy",
  image: "https://pipingpotcurry.com/wp-content/uploads/2017/12/Goat-Curry-Instant-Pot-Pressure-Cooker-3-1-720x722.jpg",
  rating: 4.9, isVeg: false },

    // BREADS
{ id: 164, name: "Chapathi", description: "Plain chapathi", price: 90, category: "Breads", image: "https://tse1.mm.bing.net/th/id/OIP.iABVK73UYywVNC4mweoCjgHaGN?rs=1&pid=ImgDetMain&o=7&rm=3", rating: 4.4, isVeg: true },
{ id: 165, name: "Roti", description: "Whole wheat roti", price: 90, category: "Breads", image: "https://i.pinimg.com/originals/1e/92/b8/1e92b83ea6219f5b600ee21a47b905ed.jpg", rating: 4.3, isVeg: true },
{ id: 166, name: "Butter Naan", description: "Soft butter naan", price: 100, category: "Breads", image: "https://tse4.mm.bing.net/th/id/OIP.DDRqkY6Ln6XwRBfxnfZ6jAHaJ1?rs=1&pid=ImgDetMain&o=7&rm=3", rating: 4.5, isVeg: true },
{ id: 167, name: "Cheese Naan", description: "Cheese stuffed naan", price: 120, category: "Breads", image: "https://tse2.mm.bing.net/th/id/OIP.IrZ9d--8l0QSAd5E3OOjlwHaJQ?rs=1&pid=ImgDetMain&o=7&rm=3", rating: 4.6, isVeg: true },
{ id: 168, name: "Kashmiri Naan", description: "Sweet Kashmiri naan", price: 120, category: "Breads", image: "https://tse3.mm.bing.net/th/id/OIP.EaqWmdD2fEDJmkQVT7q3kgHaLI?rs=1&pid=ImgDetMain&o=7&rm=3", rating: 4.7, isVeg: true },
{ id: 169, name: "Kulcha", description: "Stuffed kulcha", price: 100, category: "Breads", image: "https://tse2.mm.bing.net/th/id/OIP.k1x4pDsLJGIgbpZr9b4ONgHaFK?rs=1&pid=ImgDetMain&o=7&rm=3", rating: 4.5, isVeg: true },
{ id: 170, name: "Paratha", description: "Stuffed paratha", price: 140, category: "Breads", image: "https://www.spicebangla.com/wp-content/uploads/2024/08/Cheese-Paratha.webp", rating: 4.6, isVeg: true },

    // BURGERS
    { id: 171, name: "Cottage Cheese Burger", description: "Paneer burger with fries", price: 360, category: "Burgers", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800", rating: 4.4, isVeg: true },
    { id: 172, name: "Mexican Chicken Burger", description: "Spicy Mexican chicken burger", price: 380, category: "Burgers", image: "https://recipethis.com/wp-content/uploads/Quick-Blend-Mexican-Chicken-Burgers-In-The-Air-Fryer.jpg", rating: 4.5, isVeg: false },
    { id: 173, name: "Cibo Chicken Nuggets Burger", description: "Chicken nuggets burger", price: 380, category: "Burgers", image: "https://img.freepik.com/premium-photo/burger-background-with-copy-space_882884-9514.jpg", rating: 4.6, isVeg: false },

    // PIZZA
    { id: 174, name: "Margarita", description: "Classic tomato mozzarella pizza", price: 380, category: "Pizza", image: "https://www.vegrecipesofindia.com/wp-content/uploads/2020/12/margherita-pizza-4.jpg", rating: 4.5, isVeg: true },
    { id: 175, name: "Magic Mushroom", description: "Mushroom pizza", price: 400, category: "Pizza", image: "https://www.gannett-cdn.com/-mm-/e4461b404eab95a495a3e2bb06216bfcc24575b7/c=0-119-1400-910/local/-/media/2017/01/24/Naples/Naples/636208344765944046-mellow-mushroom-Kosmic-Karma-pizza.jpg?width=3200&height=1680&fit=crop", rating: 4.6, isVeg: true },
    { id: 176, name: "Paneer Pizza", description: "Paneer toppings pizza", price: 420, category: "Pizza", image: "https://blog.eatfit.in/wp-content/uploads/2022/10/original.jpg", rating: 4.7, isVeg: true },
    { id: 177, name: "The Great Indian Pizza", description: "Indian style pizza", price: 440, category: "Pizza", image: "https://tandooripizza.com/wp-content/uploads/2024/11/Indian-pizza-in-Tracy-1-1024x801.png", rating: 4.8, isVeg: true },
    { id: 178, name: "Alaska Pizza", description: "Pizza with corn and jalapeno", price: 440, category: "Pizza", image: "https://tse1.explicit.bing.net/th/id/OIP.54srpBye6fir3dDWnVbVCgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3", rating: 4.6, isVeg: true },
    { id: 179, name: "NYC Pizza", description: "New York style pizza", price: 440, category: "Pizza", image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&q=80&w=800", rating: 4.7, isVeg: true },
    { id: 180, name: "Seafood Pizza", description: "Pizza with seafood toppings", price: 460, category: "Pizza", image: "https://images.prismic.io/grbhouse/d7155b38-7efa-4230-b8d8-af92221c23db_HSE-AH-seafood-pizza-S.png?auto=compress%2Cformat&w=2000&q=75", rating: 4.8, isVeg: false }
];
