// ================= EMAILJS CONFIG =================
const EMAILJS_CONFIG = {
    publicKey: "V-bAYKl24dj4mt7X-",
    serviceId: "service_ggrm7hp",
    orderServiceId: "service_2810u7j",
    adminTemplateId: "template_s8led8k",    
    customerTemplateId: "template_5tkfq5c",
    orderTemplateId: "template_d6crjtq"
};

// ================= INIT EMAILJS =================
const initEmailJS = () => {
    if (window.emailjs) {
        window.emailjs.init(EMAILJS_CONFIG.publicKey);
    }
};

// ================= FORMAT CURRENCY =================
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
};

// ================= SEND ADMIN EMAIL =================
const sendAdminEmail = (reservation) => {
    const templateParams = {
        name: reservation.name,
        email: reservation.email,
        date: reservation.date,
        time: reservation.time,
        people: reservation.guests,
        message: reservation.request || "None"
    };

    return window.emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.adminTemplateId,
        templateParams,
        EMAILJS_CONFIG.publicKey
    );
};

// ================= SEND CUSTOMER EMAIL =================
const sendCustomerConfirmationEmail = (reservation) => {
    if (!reservation.email) return Promise.resolve();

    const templateParams = {
        name: reservation.name,
        email: reservation.email,
        date: reservation.date,
        time: reservation.time,
        people: reservation.guests,
        restaurant_name: "CIBO",
        restaurant_address: "Anna Nagar East, Chennai",
        restaurant_phone: "+91 98765 43210"
    };

    return window.emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.customerTemplateId,
        templateParams,
        EMAILJS_CONFIG.publicKey
    );
};

// ================= SEND ORDER ADMIN EMAIL =================
const sendOrderAdminEmail = (order) => {
    const itemsList = order.items.map(item => `${item.name} x${item.quantity} - INR ${item.price * item.quantity}`).join('\n');
    
    const templateParams = {
        order_id: order.id,
        customer_name: order.customer?.name || 'Guest',
        customer_email: order.customer?.email || 'N/A',
        customer_phone: order.customer?.phone || 'N/A',
        delivery_address: order.address || 'N/A',
        items: itemsList,
        subtotal: formatCurrency(order.subtotal),
        tax: formatCurrency(order.tax),
        total: formatCurrency(order.total),
        order_date: new Date(order.date).toLocaleString(),
        instructions: order.instructions || 'None'
    };

    return window.emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.adminTemplateId,
        templateParams,
        EMAILJS_CONFIG.publicKey
    );
};

// ================= SEND ORDER CONFIRMATION EMAIL =================
const sendOrderConfirmationEmail = (order) => {
    if (!order.customer?.email) return Promise.resolve();

    const itemsList = order.items.map(item => `${item.name} x${item.quantity}`).join(', ');

    const templateParams = {
        to_email: order.customer?.email,
        customer_name: order.customer?.name || 'Guest',
        customer_email: order.customer?.email || 'N/A',
        order_id: order.id,
        order_date: new Date(order.date).toLocaleString(),
        items: itemsList,
        subtotal: formatCurrency(order.subtotal),
        tax: formatCurrency(order.tax),
        total: formatCurrency(order.total),
        delivery_address: order.address || 'N/A',
        restaurant_name: "CIBO",
        restaurant_address: "Anna Nagar East, Chennai",
        restaurant_phone: "+91 98765 43210",
        estimated_time: "35-45 mins"
    };

    return window.emailjs.send(
        EMAILJS_CONFIG.orderServiceId,
        EMAILJS_CONFIG.orderTemplateId,
        templateParams,
        EMAILJS_CONFIG.publicKey
    );
};

// ================= GENERATE INVOICE
const generateInvoice = (order) => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFillColor(10, 10, 10);
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(212, 175, 55);
    doc.setFont("times", "bold");
    doc.setFontSize(22);
    doc.text("CIBO", 105, 15, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text("Premium Dining & Delivery", 105, 22, { align: "center" });
    doc.text("Anna Nagar East, Chennai | +91 98765 43210", 105, 28, { align: "center" });

    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Order ID: #${order.id}`, 15, 50);
    doc.text(`Date: ${new Date(order.date).toLocaleString()}`, 15, 56);
    doc.text(`Customer: ${order.customer?.name || 'Guest'}`, 15, 62);
    doc.text(`Phone: ${order.customer?.phone || 'N/A'}`, 15, 68);

    const tableColumn = ["Item", "Qty", "Price", "Total"];
    const tableRows = [];

    order.items.forEach(item => {
        tableRows.push([
            item.name,
            item.quantity,
            `INR ${item.price}`,
            `INR ${item.price * item.quantity}`
        ]);
    });

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 70,
        theme: 'grid',
        headStyles: { fillColor: [10, 10, 10], textColor: [212, 175, 55] },
        styles: { fontSize: 9 }
    });

    const finalY = doc.lastAutoTable.finalY || 70;

    doc.setFontSize(11);
    doc.text(`Subtotal: ${formatCurrency(order.subtotal)}`, 140, finalY + 10);
    doc.text(`Tax (5%): ${formatCurrency(order.tax)}`, 140, finalY + 16);
    doc.setFont("helvetica", "bold");
    doc.text(`Total Paid: ${formatCurrency(order.total)}`, 140, finalY + 24);

    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text("Thank you for dining with CIBO. See you again soon.", 105, 280, { align: "center" });

    doc.save(`CIBO-Invoice-${order.id}.pdf`);
};

