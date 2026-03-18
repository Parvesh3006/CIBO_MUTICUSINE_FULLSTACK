const { useState, useEffect, useContext, createContext, useMemo } = React;
const { HashRouter, Switch, Route, Link, useHistory, useLocation } = ReactRouterDOM;
const { motion, AnimatePresence } = Motion;

const AppContext = createContext();

const AppProvider = ({ children }) => {
    const [user, setUser] = useState(DB.getUser());
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem('cibo_cart');
        return saved ? JSON.parse(saved) : [];
    });
    const [menu, setMenu] = useState(DB.getMenu());
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('cibo_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...item, quantity: 1 }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(i => i.id !== id));
    };

    const updateQuantity = (id, delta) => {
        setCart(prev => prev.map(i => {
            if (i.id === id) {
                const newQty = Math.max(0, i.quantity + delta);
                return { ...i, quantity: newQty };
            }
            return i;
        }).filter(i => i.quantity > 0));
    };

    const clearCart = () => setCart([]);

    const login = (userData) => {
        DB.setUser(userData);
        setUser(userData);
    };

    const logout = () => {
        DB.logout();
        setUser(null);
    };

    return (
        <AppContext.Provider value={{
            user, login, logout,
            cart, addToCart, removeFromCart, updateQuantity, clearCart,
            isCartOpen, setIsCartOpen,
            menu, setMenu
        }}>
            {children}
        </AppContext.Provider>
    );
};

const useApp = () => useContext(AppContext);



const Navbar = () => {
    const { user, cart, setIsCartOpen, logout } = useApp();
    const history = useHistory();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(false);

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    useEffect(() => {
        if (window.lucide) window.lucide.createIcons();
    }, [cart, user, mobileOpen, openDropdown]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setOpenDropdown(false);
        window.addEventListener("click", handleClickOutside);
        return () => window.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 sm:h-20">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <span className="text-2xl sm:text-3xl font-serif font-bold text-gold-400 tracking-tighter">
                            CIBO
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
                        <Link to="/" className="hover:text-gold-400">Home</Link>
                        <Link to="/menu" className="hover:text-gold-400">Menu</Link>
                        <Link to="/reservation" className="hover:text-gold-400">Reservations</Link>
                        {user?.email === 'admin@cibo.com' && (
                            <Link to="/admin" className="text-gold-400">Admin</Link>
                        )}
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-3">

                        {/* USER SECTION */}
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenDropdown(prev => !prev);
                                    }}
                                    className="flex items-center gap-2 text-sm text-gray-300 hover:text-white p-1"
                                >
                                    <i data-lucide="user" className="w-5 h-5"></i>
                                    <span className="hidden sm:inline">
                                        {user.name.split(' ')[0]}
                                    </span>
                                </button>

                                {openDropdown && (
                                    <div className="absolute right-0 mt-2 w-40 bg-dark-800 border border-gray-800 rounded shadow-lg z-50">
                                        <button
                                            onClick={() => {
                                                logout();
                                                setOpenDropdown(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 text-gray-300 hover:text-white"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="text-gold-400 text-sm">
                                Sign In
                            </Link>
                        )}

                        {/* CART */}
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative p-2 text-gray-300 hover:text-gold-400"
                        >
                            <i data-lucide="shopping-bag" className="w-6 h-6"></i>
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 text-xs bg-gold-400 text-black px-1 rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        {/* HAMBURGER */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="md:hidden text-gray-300 hover:text-gold-400"
                        >
                            <i data-lucide={mobileOpen ? "x" : "menu"} className="w-6 h-6"></i>
                        </button>
                    </div>
                </div>

                {/* MOBILE MENU */}
                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-dark-800 border-t border-white/10"
                        >
                            <div className="p-4 space-y-2">
                                <Link to="/" onClick={() => setMobileOpen(false)}>Home</Link>
                                <Link to="/menu" onClick={() => setMobileOpen(false)}>Menu</Link>
                                <Link to="/reservation" onClick={() => setMobileOpen(false)}>Reservations</Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
};

const CartDrawer = () => {
    const { isCartOpen, setIsCartOpen, cart, updateQuantity, removeFromCart } = useApp();
    const history = useHistory();

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    useEffect(() => { lucide.createIcons(); }, [isCartOpen, cart]);

    const handleCheckout = () => {
        setIsCartOpen(false);
        history.push('/checkout');
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-black/80 z-[60] backdrop-blur-sm"
                    />
                    <motion.div 
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 w-full max-w-md bg-dark-800 border-l border-white/10 shadow-2xl z-[70] flex flex-col"
                    >
                        <div className="flex items-center justify-between p-6 border-b border-white/5">
                            <h2 className="text-xl font-serif font-semibold text-white">Your Order</h2>
                            <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-white">
                                <i data-lucide="x" className="w-6 h-6"></i>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {cart.length === 0 ? (
                                <div className="text-center py-20">
                                    <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <i data-lucide="shopping-bag" className="w-8 h-8 text-gray-500"></i>
                                    </div>
                                    <p className="text-gray-400">Your cart is empty.</p>
                                    <button onClick={() => { setIsCartOpen(false); history.push('/menu'); }} className="mt-4 text-gold-400 hover:text-gold-300 font-medium">
                                        Browse Menu
                                    </button>
                                </div>
                            ) : (
                                cart.map(item => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className={`w-2 h-2 mt-2 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="font-medium text-white">{item.name}</h3>
                                                <span className="text-gray-400 text-sm">₹{item.price * item.quantity}</span>
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center border border-white/10 rounded-lg overflow-hidden">
                                                    <button onClick={() => updateQuantity(item.id, -1)} className="px-3 py-1 hover:bg-white/5 text-gray-400">-</button>
                                                    <span className="px-2 text-sm text-white">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, 1)} className="px-3 py-1 hover:bg-white/5 text-green-400">+</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="p-6 bg-dark-700 border-t border-white/5">
                                <div className="flex justify-between mb-4 text-lg font-medium text-white">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(subtotal)}</span>
                                </div>
                                <button 
                                    onClick={handleCheckout}
                                    className="w-full py-4 bg-gold-500 hover:bg-gold-600 text-black font-bold text-lg rounded-xl transition-colors shadow-lg shadow-gold-500/20"
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

const MenuItem = ({ item, onAdd }) => (
    <div className="glass-card rounded-xl overflow-hidden p-4 flex gap-4">
        <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 relative">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-xs text-white font-medium flex items-center gap-1">
                <i data-lucide="star" className="w-3 h-3 text-gold-400 fill-gold-400"></i>
                {item.rating}
            </div>
        </div>
        <div className="flex-1 flex flex-col justify-between">
            <div>
                <div className="flex items-start justify-between">
                    <h3 className="font-serif font-semibold text-lg text-white leading-tight">{item.name}</h3>
                    <div className={`w-3 h-3 rounded-full border ${item.isVeg ? 'border-green-500 bg-green-500/20' : 'border-red-500 bg-red-500/20'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full mx-auto mt-[2px] ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    </div>
                </div>
                <p className="text-gray-400 text-sm mt-1 line-clamp-2">{item.description}</p>
            </div>
            <div className="flex items-center justify-between mt-3">
                <span className="text-gold-400 font-medium text-lg">₹{item.price}</span>
                <button 
                    onClick={() => onAdd(item)}
                    className="bg-white/10 hover:bg-gold-500 hover:text-black text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                >
                    ADD +
                </button>
            </div>
        </div>
    </div>
);



const Home = () => {
    return (
        <div className="min-h-screen">
            <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/80 to-transparent z-10"></div>
                    <img 
                        src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1920" 
                        className="w-full h-full object-cover animate-float scale-110"
                        style={{animationDuration: '20s'}}
                        alt="Background" 
                    />
                </div>
                
                <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-gold-400 tracking-[0.2em] text-sm font-bold uppercase mb-4">Fine Dining & Late Night Delivery</h2>
<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-white mb-6 leading-tight">
                            Experience the Art of <span className="text-gold-gradient italic">Culinary Luxury</span>
                        </h1>
                        <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                            Continental, Pan-Asian, and Authentic Indian flavors crafted for the connoisseur.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/menu" className="px-8 py-4 bg-gold-500 text-black font-bold rounded-lg hover:bg-gold-400 transition-all transform hover:scale-105">
                                Order Online
                            </Link>
                            <Link to="/reservation" className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-lg hover:bg-white/20 transition-all border border-white/10">
                                Book a Table
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className="py-20 px-4 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-serif font-bold text-white mb-4">Our Signature Dishes</h2>
                    <div className="w-24 h-1 bg-gold-500 mx-auto"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: 'Lamb Stroganoff', desc: 'Tender lamb in rich creamy sauce with herbs.', price: '₹680', category: 'Main Course', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600' },
                        { title: 'Mix Seafood Broth', desc: 'Light and flavorful broth with fresh seafood.', price: '₹300', category: 'Continental Soup', img: 'https://yumfamilyrecipes.com/wp-content/uploads/2025/05/171-Creamy-Seafood-Chowder.png' },
                        { title: 'Cibo Grilled Chicken Steak', desc: 'Juicy grilled chicken steak with signature spices.', price: '₹580', category: 'Main Course', img: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?auto=format&fit=crop&q=80&w=600' },
                        { title: 'Royal Seafood Lasagna', desc: 'Layers of pasta with succulent seafood.', price: '₹520', category: 'Pasta', img: 'https://images.unsplash.com/photo-1619895092538-128341789043?auto=format&fit=crop&q=80&w=600' },
                        { title: 'The Great Indian Pizza', desc: 'Indian-inspired pizza with exotic spices.', price: '₹440', category: 'Pizza', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=600' },
                        { title: 'Gulabi Kebab', desc: 'Tender pink kebab with aromatic spices.', price: '₹620', category: 'Non-Veg Starters', img: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&q=80&w=600' }
                    ].map((card, idx) => (
<Link to="/menu" key={idx} className="group relative h-80 sm:h-96 rounded-xl overflow-hidden cursor-pointer">
                            <img src={card.img} alt={card.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                            <div className="absolute bottom-0 left-0 p-8">
                                <span className="text-gold-400 text-xs font-medium uppercase tracking-wider">{card.category}</span>
                                <h3 className="text-2xl font-serif text-white mb-2">{card.title}</h3>
                                <p className="text-gray-400 mb-2">{card.desc}</p>
                                <span className="text-gold-400 font-bold text-lg">{card.price}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
};

const Menu = () => {
    const { menu, addToCart } = useApp();
    const [activeCat, setActiveCat] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");

    const filteredMenu = menu.filter(item => {
        const matchesCat = activeCat === "All" || item.category === activeCat;
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCat && matchesSearch;
    });

    return (
        <div className="pt-24 min-h-screen bg-dark-900 pb-20 menu-container">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Search & Filter Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-white mb-2">Our Menu</h1>
                        <p className="text-gray-400">Crafted with passion, served with elegance.</p>
                    </div>
<div className="relative w-full sm:w-72 md:w-96">
                        <i data-lucide="search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5"></i>
                        <input 
                            type="text" 
                            placeholder="Search for dishes..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-dark-800 border border-white/10 rounded-full py-3 pl-12 pr-4 text-white focus:outline-none focus:border-gold-500 transition-colors"
                        />
                    </div>
                </div>

                {/* Categories Sticky */}
<div className="sticky top-20 z-30 category-nav py-4 mb-8 no-scrollbar overflow-x-auto">
                    <div className="flex gap-4 min-w-max px-2">
                        <button 
                            onClick={() => setActiveCat("All")}
                            className={`px-6 py-3 rounded-full text-sm font-semibold transition-all relative overflow-hidden ${activeCat === "All" ? 'bg-gold-500 text-black shadow-lg shadow-gold-500/50 active' : 'bg-transparent text-gray-300 hover:text-gold-400 hover:bg-gold-500/20 border border-transparent hover:border-gold-400/50'}`}
                        >
                            All
                        </button>
                        {CATEGORIES.map(cat => (
                            <button 
                                key={cat}
                                onClick={() => setActiveCat(cat)}
                                className={`px-6 py-3 rounded-full text-sm font-semibold transition-all relative overflow-hidden ${activeCat === cat ? 'bg-gold-500 text-black shadow-lg shadow-gold-500/50 active' : 'bg-transparent text-gray-300 hover:text-gold-400 hover:bg-gold-500/20 border border-transparent hover:border-gold-400/50'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredMenu.map(item => (
                        <MenuItem key={item.id} item={item} onAdd={addToCart} />
                    ))}
                </div>

                {filteredMenu.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">No dishes found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const Login = () => {
    const { login } = useApp();
    const history = useHistory();
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    });
    const [error, setError] = useState('');
    
    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (isRegister) {
            // Registration - save user to localStorage
            const users = JSON.parse(localStorage.getItem('cibo_users') || '[]');
            
            // Check if email already exists
            if (users.find(u => u.email === formData.email)) {
                setError('Email already registered. Please login.');
                return;
            }
            
            // Save new user
            const newUser = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password
            };
            users.push(newUser);
            localStorage.setItem('cibo_users', JSON.stringify(users));
            
            // Auto login after registration
            login({ name: formData.name, email: formData.email, phone: formData.phone });
            history.push('/');
        } else {
            // Login - verify credentials
            const users = JSON.parse(localStorage.getItem('cibo_users') || '[]');
            const user = users.find(u => u.email === formData.email && u.password === formData.password);
            
            if (user) {
                login({ name: user.name, email: user.email, phone: user.phone });
                history.push('/');
            } else if (formData.email === 'admin@cibo.com' && formData.password === 'admin123') {
                // Admin login
                login({ name: 'Administrator', email: 'admin@cibo.com', phone: '9876543210' });
                history.push('/admin');
            } else {
                setError('Invalid email or password. Please register if you don\'t have an account.');
            }
        }
    };

    return (
        <div className="min-h-screen pt-20 flex items-center justify-center bg-dark-900 p-4">
            <div className="w-full max-w-md glass-panel p-8 rounded-2xl border border-white/10">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-serif font-bold text-white mb-2">
                        {isRegister ? 'Create Account' : 'Welcome Back'}
                    </h2>
                    <p className="text-gray-400">
                        {isRegister ? 'Register to start ordering' : 'Enter your details to access your account'}
                    </p>
                </div>
                
                {error && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    {isRegister && (
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                            <input 
                                type="text" 
                                required
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                className="w-full bg-dark-800 border border-white/10 rounded-lg p-3 text-white focus:border-gold-500 focus:outline-none"
                                placeholder="Your full name"
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                        <input 
                            type="email" 
                            required
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                            className="w-full bg-dark-800 border border-white/10 rounded-lg p-3 text-white focus:border-gold-500 focus:outline-none"
                            placeholder="you@example.com"
                        />
                    </div>
                    {isRegister && (
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Mobile Number</label>
                            <input 
                                type="tel" 
                                required
                                value={formData.phone}
                                onChange={e => setFormData({...formData, phone: e.target.value})}
                                className="w-full bg-dark-800 border border-white/10 rounded-lg p-3 text-white focus:border-gold-500 focus:outline-none"
                                placeholder="+91 98765 43210"
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                        <input 
                            type="password" 
                            required
                            value={formData.password}
                            onChange={e => setFormData({...formData, password: e.target.value})}
                            className="w-full bg-dark-800 border border-white/10 rounded-lg p-3 text-white focus:border-gold-500 focus:outline-none"
                            placeholder="Enter password"
                        />
                    </div>
                    <button type="submit" className="w-full bg-gold-500 text-black font-bold py-3 rounded-lg hover:bg-gold-600 transition-colors">
                        {isRegister ? 'Create Account' : 'Sign In'}
                    </button>
                </form>
                
                <div className="mt-6 text-center">
                    <button 
                        onClick={() => {
                            setIsRegister(!isRegister);
                            setError('');
                        }}
                        className="text-sm text-gold-400 hover:text-gold-300"
                    >
                        {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Register"}
                    </button>
                </div>
                
                {!isRegister && (
                    <p className="text-center text-xs text-gray-500 mt-4">
                        Admin: <span className="text-white">admin@cibo.com</span> / <span className="text-white">admin123</span>
                    </p>
                )}
            </div>
        </div>
    );
};

const Checkout = () => {
    const { cart, user, clearCart } = useApp();
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    if (cart.length === 0) {
        return (
            <div className="min-h-screen pt-32 text-center">
                <h2 className="text-2xl text-white">Your cart is empty</h2>
                <Link to="/menu" className="text-gold-400 underline mt-4 block">Go to Menu</Link>
            </div>
        );
    }

    if (!user) {
        history.push('/login');
        return null;
    }

    const handleOrder = (e) => {
        e.preventDefault();
        setLoading(true);

        const orderData = {
            id: Math.floor(100000 + Math.random() * 900000),
            date: new Date().toISOString(),
            items: cart,
            subtotal,
            tax,
            total,
            customer: user,
            address: e.target.address.value,
            instructions: e.target.instructions.value
        };

        setTimeout(() => {
            clearCart();
            history.push({
                pathname: '/order-success',
                state: { order: orderData }
            });
        }, 2000);
    };

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 bg-dark-900">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-white mb-6">Delivery Details</h2>
                    <form id="checkout-form" onSubmit={handleOrder} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-gray-400 text-sm mb-1 block">Name</label>
                                <input type="text" value={user.name} disabled className="w-full bg-dark-800 border border-white/10 rounded-lg p-3 text-gray-500 cursor-not-allowed" />
                            </div>
                            <div>
                                <label className="text-gray-400 text-sm mb-1 block">Phone</label>
                                <input type="text" value={user.phone} disabled className="w-full bg-dark-800 border border-white/10 rounded-lg p-3 text-gray-500 cursor-not-allowed" />
                            </div>
                        </div>
                        <div>
                            <label className="text-gray-400 text-sm mb-1 block">Delivery Address</label>
                            <textarea name="address" required className="w-full bg-dark-800 border border-white/10 rounded-lg p-3 text-white h-24 focus:border-gold-500 outline-none" placeholder="Enter complete address"></textarea>
                        </div>
                        <div>
                            <label className="text-gray-400 text-sm mb-1 block">Cooking Instructions</label>
                            <input name="instructions" type="text" className="w-full bg-dark-800 border border-white/10 rounded-lg p-3 text-white focus:border-gold-500 outline-none" placeholder="e.g. Less spicy, no cutlery" />
                        </div>
                    </form>
                </div>

                <div>
                    <h2 className="text-2xl font-serif font-bold text-white mb-6">Order Summary</h2>
                    <div className="glass-panel p-6 rounded-xl">
                        <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                            {cart.map(item => (
                                <div key={item.id} className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="text-gold-400 text-sm">x{item.quantity}</div>
                                        <div className="text-gray-300">{item.name}</div>
                                    </div>
                                    <div className="text-white">₹{item.price * item.quantity}</div>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-2 border-t border-white/10 pt-4 text-sm text-gray-400">
                            <div className="flex justify-between">
                                <span>Item Total</span>
                                <span>{formatCurrency(subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Taxes & Charges (5%)</span>
                                <span>{formatCurrency(tax)}</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/10 text-xl font-bold text-white">
                            <span>To Pay</span>
                            <span>{formatCurrency(total)}</span>
                        </div>
                        <button 
                            form="checkout-form"
                            disabled={loading}
                            className="w-full mt-6 bg-gold-500 hover:bg-gold-600 text-black font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? <div className="loader"></div> : 'Place Order'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const OrderSuccess = () => {
    const location = useLocation();
    const history = useHistory();
    const order = location.state?.order;

    useEffect(() => {
        if (!order) history.push('/');
        lucide.createIcons();
    }, [order]);

    if (!order) return null;

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 bg-dark-900 flex items-center justify-center">
            <div className="text-center max-w-lg w-full">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(34,197,94,0.5)]">
                    <i data-lucide="check" className="w-10 h-10 text-white"></i>
                </div>
                <h1 className="text-4xl font-serif font-bold text-white mb-2">Order Confirmed!</h1>
                <p className="text-gray-400 mb-8">Thank you for ordering, {order.customer?.name || 'Guest'}. Your food is being prepared.</p>

                <div className="glass-panel p-6 rounded-xl text-left mb-8">
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-400">Order ID</span>
                        <span className="text-white font-mono">#{order.id}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-400">Customer</span>
                        <span className="text-white">{order.customer?.name || 'Guest'}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-400">Phone</span>
                        <span className="text-white">{order.customer?.phone || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-400">Total Paid</span>
                        <span className="text-gold-400 font-bold">{formatCurrency(order.total)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Estimated Time</span>
                        <span className="text-white">35-45 mins</span>
                    </div>
                </div>

                <div className="flex gap-4 justify-center">
                    <button 
                        onClick={() => generateInvoice(order)}
                        className="flex items-center gap-2 px-6 py-3 bg-dark-800 border border-white/20 hover:bg-dark-700 text-white rounded-lg transition-colors"
                    >
                        <i data-lucide="download" className="w-4 h-4"></i> Download Bill
                    </button>
                    <Link 
                        to="/" 
                        className="px-6 py-3 bg-gold-500 text-black font-bold rounded-lg hover:bg-gold-600 transition-colors"
                    >
                        Back Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

const Reservation = () => {
    const [status, setStatus] = useState('idle'); // idle, loading, success
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', date: '', time: '', guests: 2, request: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('loading');
        
        // Initialize EmailJS on first use
        initEmailJS();
        
        setTimeout(async () => {
            const reservation = DB.addReservation(formData);
            
            // Send emails after successful booking
            try {
                await sendAdminEmail(reservation);
                await sendCustomerConfirmationEmail(reservation);
            } catch (emailError) {
                console.error("Email sending failed:", emailError);
            }
            
            setStatus('success');
        }, 1500);
    };

    if (status === 'success') {
        return (
            <div className="min-h-screen pt-24 px-4 flex items-center justify-center bg-dark-900">
                <div className="text-center">
                    <h2 className="text-3xl font-serif text-white mb-4">Table Reserved</h2>
                    <p className="text-gray-400 mb-6">We await your arrival on {formData.date} at {formData.time}.</p>
                    <button onClick={() => setStatus('idle')} className="text-gold-400 underline">Book another</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 px-4 bg-dark-900 flex items-center justify-center reservation-container">
            <div className="w-full max-w-2xl">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-serif font-bold text-white mb-2">Book a Table</h1>
                    <p className="text-gray-400">Reserve your spot at Chennai's finest late-night destination.</p>
                </div>

                <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-2xl border border-white/10 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Name</label>
                            <input type="text" required onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-dark-800 border border-white/10 rounded-lg p-3 text-white focus:border-gold-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Phone</label>
                            <input type="tel" required onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-dark-800 border border-white/10 rounded-lg p-3 text-white focus:border-gold-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Email</label>
                            <input type="email" required onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-dark-800 border border-white/10 rounded-lg p-3 text-white focus:border-gold-500 outline-none" placeholder="parveshshanmugam@gmail.com" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Date</label>
                            <input type="date" required onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-dark-800 border border-white/10 rounded-lg p-3 text-white focus:border-gold-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Time</label>
                            <select required onChange={e => setFormData({...formData, time: e.target.value})} className="w-full bg-dark-800 border border-white/10 rounded-lg p-3 text-white focus:border-gold-500 outline-none">
                                <option value="">Select Time</option>
                                <option>12:00 PM</option> <option>1:00 PM</option> <option>2:00 PM</option>
                                <option>7:00 PM</option> <option>8:00 PM</option> <option>9:00 PM</option>
                                <option>10:00 PM</option> <option>11:00 PM</option> <option>12:00 AM</option>
                                <option>1:00 AM</option> <option>2:00 AM</option> <option>3:00 AM</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Guests</label>
                            <select onChange={e => setFormData({...formData, guests: e.target.value})} className="w-full bg-dark-800 border border-white/10 rounded-lg p-3 text-white focus:border-gold-500 outline-none">
                                {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} People</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Special Request</label>
                            <input type="text" onChange={e => setFormData({...formData, request: e.target.value})} placeholder="Birthday, Anniversary..." className="w-full bg-dark-800 border border-white/10 rounded-lg p-3 text-white focus:border-gold-500 outline-none" />
                        </div>
                    </div>
                    <button 
                        type="submit" 
                        disabled={status === 'loading'}
                        className="w-full bg-gold-500 text-black font-bold py-4 rounded-lg hover:bg-gold-600 transition-colors mt-6"
                    >
                        {status === 'loading' ? 'Booking...' : 'Confirm Reservation'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const Admin = () => {
    const { user, menu, setMenu } = useApp();
    const history = useHistory();
    const [view, setView] = useState('menu'); // menu, reservations
    const [reservations, setReservations] = useState([]);
    const [isEditing, setIsEditing] = useState(null);


    const [itemForm, setItemForm] = useState({ name: '', description: '', price: '', category: 'Continental', image: '', isVeg: true });

    useEffect(() => {
        if (!user || user.email !== 'admin@cibo.com') {
            history.push('/login');
            return;
        }
        setReservations(DB.getReservations());
    }, [user]);

    const handleSaveItem = (e) => {
        e.preventDefault();
        let newMenu;
        if (isEditing) {
            newMenu = menu.map(i => i.id === isEditing ? { ...itemForm, id: isEditing, price: Number(itemForm.price), rating: 4.5 } : i);
            setIsEditing(null);
        } else {
            const newItem = { ...itemForm, id: Date.now(), price: Number(itemForm.price), rating: 0 };
            newMenu = [...menu, newItem];
        }
        setMenu(newMenu);
        DB.setMenu(newMenu);
        setItemForm({ name: '', description: '', price: '', category: 'Continental', image: '', isVeg: true });
    };

    const handleDelete = (id) => {
        if(confirm('Delete this item?')) {
            const newMenu = menu.filter(i => i.id !== id);
            setMenu(newMenu);
            DB.setMenu(newMenu);
        }
    };

    const handleEdit = (item) => {
        setIsEditing(item.id);
        setItemForm(item);
    };

    return (
        <div className="min-h-screen pt-24 pb-10 px-4 bg-dark-900">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-serif text-white">Admin Dashboard</h1>
                    <div className="flex gap-4">
                        <button onClick={() => setView('menu')} className={`px-4 py-2 rounded-lg ${view === 'menu' ? 'bg-gold-500 text-black' : 'bg-dark-800 text-white'}`}>Menu</button>
                        <button onClick={() => setView('reservations')} className={`px-4 py-2 rounded-lg ${view === 'reservations' ? 'bg-gold-500 text-black' : 'bg-dark-800 text-white'}`}>Reservations</button>
                    </div>
                </div>

                {view === 'menu' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Form */}
                        <div className="lg:col-span-1">
                            <div className="glass-panel p-6 rounded-xl sticky top-24">
                                <h3 className="text-xl text-white mb-4">{isEditing ? 'Edit Item' : 'Add New Item'}</h3>
                                <form onSubmit={handleSaveItem} className="space-y-4">
                                    <input placeholder="Item Name" required value={itemForm.name} onChange={e => setItemForm({...itemForm, name: e.target.value})} className="w-full bg-dark-800 p-3 rounded border border-white/10 text-white" />
                                    <textarea placeholder="Description" required value={itemForm.description} onChange={e => setItemForm({...itemForm, description: e.target.value})} className="w-full bg-dark-800 p-3 rounded border border-white/10 text-white" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="number" placeholder="Price" required value={itemForm.price} onChange={e => setItemForm({...itemForm, price: e.target.value})} className="w-full bg-dark-800 p-3 rounded border border-white/10 text-white" />
                                        <select value={itemForm.category} onChange={e => setItemForm({...itemForm, category: e.target.value})} className="w-full bg-dark-800 p-3 rounded border border-white/10 text-white">
                                            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <input placeholder="Image URL" required value={itemForm.image} onChange={e => setItemForm({...itemForm, image: e.target.value})} className="w-full bg-dark-800 p-3 rounded border border-white/10 text-white" />
                                    <div className="flex items-center gap-2 text-white">
                                        <input type="checkbox" checked={itemForm.isVeg} onChange={e => setItemForm({...itemForm, isVeg: e.target.checked})} />
                                        <span>Vegetarian</span>
                                    </div>
                                    <button type="submit" className="w-full bg-white text-black font-bold py-3 rounded hover:bg-gray-200">{isEditing ? 'Update' : 'Add Item'}</button>
                                    {isEditing && <button type="button" onClick={() => {setIsEditing(null); setItemForm({ name: '', description: '', price: '', category: 'Continental', image: '', isVeg: true })}} className="w-full bg-transparent text-gray-400 py-2">Cancel</button>}
                                </form>
                            </div>
                        </div>

                        {/* List */}
                        <div className="lg:col-span-2 space-y-4">
                            {menu.map(item => (
                                <div key={item.id} className="glass-card p-4 rounded-lg flex justify-between items-center">
                                    <div className="flex gap-4 items-center">
                                        <img src={item.image} className="w-16 h-16 rounded object-cover" />
                                        <div>
                                            <h4 className="text-white font-bold">{item.name}</h4>
                                            <p className="text-sm text-gray-400">₹{item.price} • {item.category}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(item)} className="p-2 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30">Edit</button>
                                        <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reservations.length === 0 && <p className="text-gray-400">No reservations found.</p>}
                        {reservations.map(res => (
                            <div key={res.id} className="glass-panel p-6 rounded-xl flex flex-col md:flex-row justify-between md:items-center gap-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white">{res.name}</h3>
                                    <p className="text-gold-400">{res.date} at {res.time} • {res.guests} Guests</p>
                                    <p className="text-gray-400 text-sm">Phone: {res.phone}</p>
                                    {res.request && <p className="text-gray-400 text-sm italic">"{res.request}"</p>}
                                </div>
                                <div className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-bold text-center border border-green-500/20">
                                    {res.status}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};



const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
    return null;
};

const Footer = () => {
    return (
        <footer style={{
            background: 'linear-gradient(180deg, #0a0a0a 0%, #111008 100%)',
            borderTop: '1px solid rgba(212, 175, 55, 0.2)',
            fontFamily: '"Cormorant Garamond", Georgia, serif',
        }}>
            {/* Top gold divider line */}
            <div style={{
                height: '1px',
                background: 'linear-gradient(90deg, transparent, #D4AF37, #F5E57A, #D4AF37, transparent)',
                opacity: 0.6,
            }} />

            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '56px 32px 0' }}>

                {/* Main grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '48px',
                    alignItems: 'start',
                }}>

                    {/* Brand Column */}
                    <div style={{ gridColumn: 'span 1' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                            <img
                                src="images/logo.png"
                                alt="CIBO Logo"
                                style={{ height: '52px', width: 'auto' }}
                                onError={(e) => e.target.style.display = 'none'}
                            />
                            <span style={{
                                fontSize: '2.4rem',
                                fontFamily: '"Cormorant Garamond", Georgia, serif',
                                fontWeight: 700,
                                letterSpacing: '0.18em',
                                background: 'linear-gradient(135deg, #D4AF37 0%, #F5E57A 50%, #D4AF37 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                lineHeight: 1,
                            }}>
                                CIBO
                            </span>
                        </div>
                        <p style={{
                            color: '#9a9076',
                            fontSize: '0.82rem',
                            lineHeight: 1.8,
                            letterSpacing: '0.03em',
                            maxWidth: '240px',
                            fontFamily: '"Raleway", sans-serif',
                            fontWeight: 400,
                        }}>
                            A premier fine-dining & multi-cuisine destination across Tamil Nadu — crafting unforgettable experiences since day one.
                        </p>
                        <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
                            {/* Social icons */}
                            {[
                                { label: 'Instagram', href: 'https://www.instagram.com/cibo_chennai/?hl=en', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
                                { label: 'X (Twitter)', href: 'https://x.com/cibo_chennai', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.727-8.853L1.254 2.25H8.08l4.261 5.632 5.903-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
                                { label: 'Facebook', href: 'https://www.facebook.com/ciborestaurantchennai/', path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
                            ].map(({ label, href, path }) => (
                                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} style={{
                                    width: '34px', height: '34px',
                                    borderRadius: '50%',
                                    border: '1px solid rgba(212,175,55,0.3)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer',
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.15)'; e.currentTarget.style.borderColor = '#D4AF37'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)'; }}
                                >
                                    <svg viewBox="0 0 24 24" width="14" height="14" fill="#D4AF37">
                                        <path d={path} />
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Location Column */}
                    <div>
                        <h3 style={{
                            color: '#D4AF37',
                            fontSize: '0.65rem',
                            letterSpacing: '0.22em',
                            textTransform: 'uppercase',
                            fontFamily: '"Raleway", sans-serif',
                            fontWeight: 600,
                            marginBottom: '20px',
                            paddingBottom: '10px',
                            borderBottom: '1px solid rgba(212,175,55,0.2)',
                        }}>
                            Our Location
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div>
                                <p style={{
                                    color: '#e8dfc0',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    marginBottom: '4px',
                                    letterSpacing: '0.04em',
                                }}>
                                    Anna Nagar East, Chennai
                                </p>
                                <p style={{
                                    color: '#7a7260',
                                    fontSize: '0.78rem',
                                    lineHeight: 1.7,
                                    fontFamily: '"Raleway", sans-serif',
                                }}>
                                    J11, 6th Ave, J Block<br />
                                    Anna Nagar East, Chennai
                                </p>
                            </div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginTop: '4px',
                            }}>
                                <span style={{
                                    width: '7px', height: '7px',
                                    borderRadius: '50%',
                                    background: '#4ade80',
                                    boxShadow: '0 0 6px #4ade80',
                                    flexShrink: 0,
                                }} />
                                <span style={{
                                    color: '#9a9076',
                                    fontSize: '0.75rem',
                                    fontFamily: '"Raleway", sans-serif',
                                    letterSpacing: '0.04em',
                                }}>
                                    Open until <strong style={{ color: '#e8dfc0' }}>4:00 AM</strong>
                                </span>
                            </div>
                            <a href="mailto:cibochennai@gmail.com" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: '#9a9076',
                                fontSize: '0.78rem',
                                fontFamily: '"Raleway", sans-serif',
                                textDecoration: 'none',
                                marginTop: '2px',
                                transition: 'color 0.2s',
                            }}
                                onMouseEnter={e => e.currentTarget.style.color = '#D4AF37'}
                                onMouseLeave={e => e.currentTarget.style.color = '#9a9076'}
                            >
                                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                                cibochennai@gmail.com
                            </a>
                        </div>
                    </div>

                    {/* Cuisine / About Column */}
                    <div>
                        <h3 style={{
                            color: '#D4AF37',
                            fontSize: '0.65rem',
                            letterSpacing: '0.22em',
                            textTransform: 'uppercase',
                            fontFamily: '"Raleway", sans-serif',
                            fontWeight: 600,
                            marginBottom: '20px',
                            paddingBottom: '10px',
                            borderBottom: '1px solid rgba(212,175,55,0.2)',
                        }}>
                            Our Cuisine
                        </h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '9px' }}>
                            {['Continental', 'North Indian', 'Pan-Asian', 'Italian', 'Fine Dining', 'Late Night Service'].map(item => (
                                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{
                                        width: '16px', height: '1px',
                                        background: 'linear-gradient(90deg, #D4AF37, transparent)',
                                        flexShrink: 0,
                                    }} />
                                    <span style={{
                                        color: '#9a9076',
                                        fontSize: '0.8rem',
                                        fontFamily: '"Raleway", sans-serif',
                                        letterSpacing: '0.04em',
                                    }}>
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Certifications Column */}
                    <div>
                        <h3 style={{
                            color: '#D4AF37',
                            fontSize: '0.65rem',
                            letterSpacing: '0.22em',
                            textTransform: 'uppercase',
                            fontFamily: '"Raleway", sans-serif',
                            fontWeight: 600,
                            marginBottom: '20px',
                            paddingBottom: '10px',
                            borderBottom: '1px solid rgba(212,175,55,0.2)',
                        }}>
                            Certifications
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[
                                {
                                    icon: '✦',
                                    title: 'FSSAI Licensed',
                                    sub: 'Food Safety & Standards Authority of India',
                                },
                                {
                                    icon: '✦',
                                    title: 'Hygiene Certified',
                                    sub: 'Certified clean kitchen practices',
                                },
                                {
                                    icon: '✦',
                                    title: 'Pure Veg Options',
                                    sub: 'Clearly marked veg & non-veg menu',
                                },
                            ].map(({ icon, title, sub }) => (
                                <div key={title} style={{
                                    display: 'flex',
                                    gap: '12px',
                                    alignItems: 'flex-start',
                                    padding: '10px 12px',
                                    border: '1px solid rgba(212,175,55,0.1)',
                                    borderRadius: '6px',
                                    background: 'rgba(212,175,55,0.03)',
                                }}>
                                    <span style={{ color: '#D4AF37', fontSize: '0.65rem', marginTop: '3px', flexShrink: 0 }}>{icon}</span>
                                    <div>
                                        <p style={{
                                            color: '#e8dfc0',
                                            fontSize: '0.8rem',
                                            fontWeight: 600,
                                            letterSpacing: '0.04em',
                                            marginBottom: '2px',
                                        }}>
                                            {title}
                                        </p>
                                        <p style={{
                                            color: '#6b6454',
                                            fontSize: '0.7rem',
                                            fontFamily: '"Raleway", sans-serif',
                                            lineHeight: 1.5,
                                        }}>
                                            {sub}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Tagline strip */}
                <div style={{
                    margin: '48px 0 0',
                    padding: '18px 0',
                    borderTop: '1px solid rgba(212,175,55,0.1)',
                    borderBottom: '1px solid rgba(212,175,55,0.1)',
                    textAlign: 'center',
                }}>
                    <p style={{
                        color: 'rgba(212,175,55,0.45)',
                        fontSize: '0.7rem',
                        letterSpacing: '0.35em',
                        textTransform: 'uppercase',
                        fontFamily: '"Cormorant Garamond", Georgia, serif',
                        fontStyle: 'italic',
                    }}>
                        Fine Dining · Multi-Cuisine · Late Night · Tamil Nadu
                    </p>
                </div>

                {/* Bottom bar */}
                <div style={{
                    padding: '20px 0 24px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px',
                }}>
                    <p style={{
                        color: '#4a4538',
                        fontSize: '0.72rem',
                        fontFamily: '"Raleway", sans-serif',
                        letterSpacing: '0.06em',
                    }}>
                        © {new Date().getFullYear()} CIBO Restaurant. All rights reserved.
                    </p>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        {['Privacy Policy', 'Terms of Service'].map(link => (
                            <a key={link} href="#" style={{
                                color: '#4a4538',
                                fontSize: '0.72rem',
                                fontFamily: '"Raleway", sans-serif',
                                letterSpacing: '0.06em',
                                textDecoration: 'none',
                                transition: 'color 0.2s',
                            }}
                                onMouseEnter={e => e.currentTarget.style.color = '#D4AF37'}
                                onMouseLeave={e => e.currentTarget.style.color = '#4a4538'}
                            >
                                {link}
                            </a>
                        ))}
                    </div>
                </div>

            </div>

            {/* Font imports — add to your index.html <head> instead if preferred */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Raleway:wght@300;400;500;600&display=swap');
            `}</style>
        </footer>
    );
};


const App = () => {
    return (
        <AppProvider>
            <HashRouter>
                <ScrollToTop />
                <div className="bg-dark-900 min-h-screen font-sans text-gray-200">
                    <Navbar />
                    <CartDrawer />
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route path="/menu" component={Menu} />
                        <Route path="/login" component={Login} />
                        <Route path="/checkout" component={Checkout} />
                        <Route path="/order-success" component={OrderSuccess} />
                        <Route path="/reservation" component={Reservation} />
                        <Route path="/admin" component={Admin} />
                    </Switch>
                    <Footer />
                </div>
            </HashRouter>
        </AppProvider>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
