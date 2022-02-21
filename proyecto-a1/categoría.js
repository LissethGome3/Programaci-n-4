Vue.component('categoria', {
    data:()=>{
        return {
            categorias: [],
            buscar: '',
            categoria: {
                accion: 'nuevo',
                msg : '',
                idCategoria: '',
                codigo: '',
                nombre: ''
            }
        }
    },
    methods: {
        buscarCategoria(){
            this.obtenerDatos(this.buscar);
        },
        guardarCategoria(){
            this.obtenerDatos();
            let categorias = this.categorias || [];
            if(this.categoria.accion == 'nuevo'){
                this.categoria.idCategoria = idUnicoFecha();
                categorias.push(this.categoria);
            }else if(this.categoria.accion == 'modificar'){
                let index = categorias.findIndex(categoria=>categoria.idCategoria==this.categoria.idCategoria);
                categorias[index] = this.categoria;
            }else if(this.categoria.accion == 'eliminar'){
                let index = categorias.findIndex(categoria=>categoria.idCategoria==this.categoria.idCategoria);
                categorias.splice(index,1);
            }
            localStorage.setItem('categorias', JSON.stringify(this.categoria));
            this.categoria.msg = 'Categoria procesado con exito';
            this.nuevoCategoria();
            this.obtenerDatos();
        },
        modificarCategoria(data){
            this.categoria = JSON.parse(JSON.stringify(data));
            this.categoria.accion = 'modificar';
        },
        eliminarCategoria(data){
            if( confirm(`¿Esta seguro de eliminar el categoria ${data.nombre}?`) ){
                this.categoria.idCategoria = data.idCategoria;
                this.categoria.accion = 'eliminar';
                this.guardarCategoria();
            }
        },
        obtenerDatos(busqueda=''){
            this.categorias = [];
            if( localStorage.getItem('categorias')!=null ){
                for(let i=0; i<JSON.parse(localStorage.getItem('categorias')).length; i++){
                    let data = JSON.parse(localStorage.getItem('categorias'))[i];
                    if( this.buscar.length>0 ){
                        if( data.nombre.toLowerCase().indexOf(this.buscar.toLowerCase())>-1 ){
                            this.categorias.push(data);
                        }
                    }else{
                        this.categorias.push(data);
                    }
                }
            }
        },
        nuevoCategoria(){
            this.categoria.accion = 'nuevo';
            this.categoria.idCategoria = '';
            this.categoria.codigo = '';
            this.categoria.nombre = '';
            this.categoria.msg = '';
            console.log(this.categoria);
        }
    }, 
    created(){
        this.obtenerDatos();
    },
    template: `
        <div id='appCategoria'>
            <form @submit.prevent="guardarCategoria" @reset.prevent="nuevoCategoria" method="post" id="frmCategoria">
                <div class="card mb-3">
                    <div class="card-header text-white bg-dark">
                        Administracion de Categorias
                        <button type="button" class="btn-close bg-white" data-bs-dismiss="alert" data-bs-target="#frmCategoria" aria-label="Close"></button>
                    </div>
                    <div class="card-body">
                        <div class="row p-1">
                            <div class="col col-md-1">Codigo</div>
                            <div class="col col-md-2">
                                <input v-model="categoria.codigo" placeholder="codigo" pattern="[A-Z0-9]{3,10}" required title="Codigo de categoria" class="form-control" type="text">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-1">Nombre</div>
                            <div class="col col-md-2">
                                <input v-model="categoria.nombre" placeholder="escribe tu nombre" pattern="[A-Za-zÑñáéíóú ]{3,75}" required title="Nombre de categoria" class="form-control" type="text">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col col-md-3 text-center">
                                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                                    {{ categoria.msg }}
                                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col col-md-3 text-center">
                                <button type="submit" class="btn btn-primary">Guardar</button>
                                <button type="reset" class="btn btn-warning">Nuevo</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <div class="card mb-3" id="cardBuscarCategoria">
                <div class="card-header text-white bg-dark">
                    Busqueda de Categorias
                    <button type="button" class="btn-close bg-white" data-bs-dismiss="alert" data-bs-target="#cardBuscarCategoria" aria-label="Close"></button>
                </div>
                <div class="card-body">
                    <table class="table">
                        <thead>
                            <tr>
                                <td colspan="6">
                                    Buscar: <input title="Introduzca el texto a buscar" @keyup="buscarCategoria" v-model="buscar" class="form-control" type="text">
                                </td>
                            </tr>
                            <tr>
                                <th>Codigo</th>
                                <th>Nombre</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in categorias" :key="item.idCategoria" @click="modificarCategoria(item)">
                                <td>{{item.codigo}}</td>
                                <td>{{item.nombre}}</td>
                                <td>
                                    <button type="button" class="btn btn-danger" @click="eliminarCategoria(item)">Eliminar</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div> 
    `
});