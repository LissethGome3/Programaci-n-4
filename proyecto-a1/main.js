var idUnicoFecha = ()=>{
    let fecha = new Date();
    return Math.floor(fecha.getTime()/1000).toString(16);
};
var app = new Vue({
    el: '#appSistema',
    data: {
       forms:{
           'cliente':{ mostrar: false },
           'categoria':{ mostrar: false },
           'producto':{ mostrar: false },
           'proveedor':{ mostrar: false },
       }
    },
    methods: {
        
    },
    created(){
       
    }
});
document.addEventListener('DOMContentLoaded', event=>{
    let $element = document.querySelectorAll('.mostrar').forEach( (element,index)=>{
        element.addEventListener('click', e=>{
            app.forms[e.target.dataset.form].mostrar = true;
            //app.forms[e.target.dataset.form].obtenerDatos();
        });
    });
});