var BaseApiUrl = "http://localhost:8080/Lab2/index.php/api/news/";

function buildUrl(service){
    return BaseApiUrl + service;
}

window.onload = function(){
    var vm = new Vue({
        el: '#app',
        data: {
          fields: ['id','title','text', 'actions'],
          noti: {
              id: 0,
              title: '',
              text: ''
          },
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
            submitData(evt){
                evt.preventDefault();
                if (this.noti.id > 0) {
                    this.editData();
                } else {
                    this.addData();                    
                }
                this.noti.id = 0;
                this.noti.title = "";
                this.noti.text = "";
            },
            deleteData(id){
                axios.delete(buildUrl('news/' + id)).then((response) => {
                    this.getData();
                    toastr.success("La noticia fue eliminada con éxito");
                }).catch(error => {console.log(error)});
            },
            addData(){
                axios.post(
                    buildUrl('news'), 
                    {
                        id: this.noti.id,
                        title: this.noti.title,
                        text: this.noti.text
                    }
                ).then((response) => {
                    this.getData();
                    toastr.success("La noticia fue agregada con éxito");
                }).catch(error => {console.log(error)});
            },
            editData(){
                axios.put(
                    buildUrl('news'), 
                    {
                        id: this.noti.id,
                        title: this.noti.title,
                        text: this.noti.text
                    }
                ).then((response) => {
                    this.getData();
                    toastr.success("La noticia fue actualizada con éxito");
                }).catch(error => {console.log(error)});
            }, 
            getEditData(id){
                axios.get(buildUrl('news/' + id)).then((response) => {
                    this.noti.id = response.data.id;
                    this.noti.title = response.data.title;
                    this.noti.text = response.data.text;
                }).catch(error => {console.log(error)});
            },
        }
      });
}