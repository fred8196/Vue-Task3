let productModal = '';
let delProductModal = '';

Vue.createApp({
    data() {
        return {
            url: 'https://vue3-course-api.hexschool.io/',
            path: 'fred8196',
            productData: [],
            isNew: false,
            tempProduct: {
                imagesUrl: []
            }
        }
    },
    methods: {
        getProduct() {
            axios.get(`${this.url}api/${this.path}/admin/products`)
                .then(res => {
                    if (res.data.success) {
                        this.productData = res.data.products
                        console.log(this.productData);
                    }
                }).catch(err => {
                    console.log(err);
                })
        },
        checkLogin() {
            axios.post(`${this.url}api/user/check`)
                .then(res => {
                    if (res.data.success) {
                        this.getProduct();
                    } else {
                        alert(res.data.message)
                        window.location = 'index.html'
                    }
                }).catch(err => {
                    console.log(err);
                })
        },
        openModal(status, item) {
            if (status == 'new') {
                this.tempProduct = {
                    imagesUrl: []
                };
                this.isNew = true;
                productModal.show();
            } else if (status == 'edit') {
                this.tempProduct = {
                    ...item,
                }
                this.isNew = false
                productModal.show();
            } else if (status == 'delete') {
                this.tempProduct = {
                    ...item,
                }
                delProductModal.show();
            }
        },
        updateProduct() {
            let url = `${this.url}api/${this.path}/admin/product`;
            let httpMethod = 'post';
            if (!this.isNew) {
                url += `/${this.tempProduct.id}`;
                httpMethod = 'put';
            }
            axios[httpMethod](url, { data: this.tempProduct })
                .then(res => {
                    if (res.data.success) {
                        alert(res.data.message);
                        productModal.hide();
                        this.getProduct();
                    } else {
                        alert(res.data.message);
                        productModal.hide();
                    }
                }).catch(err => {
                    console.log(err);
                })
        },
        deleteProduct() {
            axios.delete(`${this.url}api/${this.path}/admin/product/${this.tempProduct.id}`)
                .then(res => {
                    if (res.data.success) {
                        alert(res.data.message);
                        delProductModal.hide();
                        this.getProduct();
                    } else {
                        alert(res.data.message)
                    }
                }).catch(err => {
                    console.log(err);
                })
        },
        addImages() {
            this.tempProduct.imagesUrl = [];
            this.tempProduct.imagesUrl.push('');
        }
    },
    mounted() {
        productModal = new bootstrap.Modal(document.querySelector('#productModal'));
        delProductModal = new bootstrap.Modal(document.querySelector('#delProductModal'));
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        axios.defaults.headers.common['Authorization'] = token;
        this.checkLogin();
    },
}).mount('#app')