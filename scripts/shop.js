
InventoryUrl = 'https://docs.google.com/spreadsheets/d/17NjpxU8WEYRAfg7oNkmDJuD52m8kFGC5BCC9_phw-Os/pubhtml';

settings = {
    'showOutOfStockItems': true,
    'allowMultipleOrder': true,
    'showDescription': false,
    'currencyUnits': '₹'
}


settings.activeCategory = "All";

categories_list = [];
Vue.config.devtools = true;

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
        loadedProducts[i]['orderQuanity'] = 0;
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
                    total += products[i]['orderQuanity'] * products[i]['Unit Price']
                }
                return total
            }
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
                    total += products[i]['orderQuanity'] * products[i]['Unit Price']
                }
                return total
            }
        }
    })
    document.getElementById('shop').style.display = "grid";
    document.getElementById('cart').style.display = "inline-block";
}
function scrollToCart(){
    document.getElementById('cart').scrollIntoView({behavior:'smooth',block:'end'})
}
