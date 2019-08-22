var BaseApiUrl = "http://localhost/Lab2/index.php/api/news/";

function buildUrl(service){
    return BaseApiUrl + service;
}

window.onload = function(){
    var vm = new Vue({
        el: '#app',
        data: {
          fields: ['id','title','text', 'actions'],
          news: []
        },
        mounted(){
            this.getData();
        },
        methods:{
            getData(){
                axios.get(buildUrl('news')).then((response) => {
                    this.news = response.data;
                }).catch(error => {console.log(error)});
            },
            deleteData(id){
                axios.delete(buildUrl('news/' + id)).then((response) => {
                    this.getData();
                }).catch(error => {console.log(error)});
            }   
        }
      });
}