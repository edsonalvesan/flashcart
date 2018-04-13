
InventoryUrl = 'https://docs.google.com/spreadsheets/d/17NjpxU8WEYRAfg7oNkmDJuD52m8kFGC5BCC9_phw-Os/pubhtml';

settings = {
    'showOutOfStockItems': true,
    'allowMultipleOrder': true,
    'showDescription': true,
    'currencyUnits': '₹',
    'shopPhoneNumber': '918310786727'
}


settings.activeCategory = "All";

categories_list = [];
//Vue.config.devtools = true;

function initShop(){
    if(sessionStorage.getItem('storedProducts') == null){
        Tabletop.init( { key: InventoryUrl, callback: loadShop, simpleSheet: true } );
    }
    else{
        setupShop();
    }
}
function loadShop(loadedProducts,tabletop) {
    for(i=0;i<loadedProducts.length;i++){
        loadedProducts[i]['orderQuantity'] = 0;
        if(loadedProducts[i]['In Stock'].toLowerCase().trim() == 'yes'){
            loadedProducts[i]['In Stock'] = true;
        }
        else{
            loadedProducts[i]['In Stock'] = false;
        }
    }
    sessionStorage.setItem("storedProducts",JSON.stringify(loadedProducts));
    setupShop();
}
function saveShop(){
    sessionStorage.setItem("storedProducts",JSON.stringify(products));
}
function setupShop(){
    products = JSON.parse(sessionStorage.getItem('storedProducts'));
    for(i=0;i<products.length;i++){
        found = false;
        cat = products[i]['Category'];
        for(j=0;j<categories_list.length;j++){
            if(cat == categories_list[j]){
                found = true;
            }
        }
        if(!found){
            categories_list.push(cat);
        }
    }
    shop = new Vue({
        el: '#shop',
        data: {
            products: products,
            settings: settings
        }
    })
    cart = new Vue({
        el: '#cart',
        data:{
            products: products,
            settings: settings
        },
        computed: {
            totalAmount: function(){
                total = 0
                for(i=0;i<products.length;i++){
                    total += products[i]['orderQuantity'] * products[i]['Unit Price']
                }
                return total
            }
        },
        mounted: function() {
            document.getElementById('loading').style.display = "none";
            document.getElementById('shop').style.display = "grid";
            document.getElementById('cart').style.display = "inline-block";
        }
    })
    categoryChooser = new Vue({
        el: '#categories',
        data:{
            categories_list: categories_list,
            settings: settings,
            products: products
        },
        computed:{
            totalAmount: function(){
                total = 0
                for(i=0;i<products.length;i++){
                    total += products[i]['orderQuantity'] * products[i]['Unit Price']
                }
                return total
            }
        }
    })

}
function scrollToCart(){
    document.getElementById('cart').scrollIntoView({behavior:'smooth',block:'end'})
}
function placeOrder(){
    ordertext = 'Hi, I would like to place an order for the following items from ' + location.hostname + ".\n\n"
    total = 0
    n = 0
    for(i=0;i<products.length;i++){
        if(products[i]['orderQuantity']>0){
            n += 1
            ordertext += n.toString() + ') ' + products[i]['Name'] + '\n'
            if(settings.allowMultipleOrder){
                ordertext += 'Quantity: ' + products[i]['orderQuantity'] + '\n'
            }
            price = parseInt(products[i]['orderQuantity']) * parseFloat(products[i]['Unit Price'])
            total += price
            ordertext += 'Price: ' + settings.currencyUnits + price.toString() + '\n\n'
        }
    }
    ordertext += 'Total Amount: ' + settings.currencyUnits + total.toString();
    orderlink = 'https://api.whatsapp.com/send?phone=' + settings.shopPhoneNumber + '&text=' + encodeURIComponent(ordertext);
    location.href = orderlink;
}
