Vue.component('producto',{
    data:()=>{
        return {
            buscar:'',
            proveedor:[],
            producto:{
                accion : 'nuevo',
                mostrar_msg : false,
                msg : '',
                idproducto : '',
                codigo: '',
                nombre: '',
                direccion: '',
                telefono: '',
                dui: ''
            }
        }
    },
    methods:{
        buscandoproducto(){
            this.obtenerproveedor(this.buscar);
        },
        eliminarproducto(producto){
            if( confirm(`Esta seguro de eliminar el producto ${producto.nombre}?`) ){
                this.producto.accion = 'eliminar';
                this.producto.idproducto = producto.idproducto;
                this.guardarproducto();
            }
            this.nuevoproducto();
        },
        modificarproducto(datos){
            this.producto = JSON.parse(JSON.stringify(datos));
            this.producto.accion = 'modificar';
        },
        guardarproducto(){
            this.obtenerproveedor();
            let proveedor = JSON.parse(localStorage.getItem('proveedor')) || [];
            if(this.producto.accion=="nuevo"){
                this.producto.idproducto = generarIdUnicoFecha();
                proveedor.push(this.producto);
            } else if(this.producto.accion=="modificar"){
                let index = proveedor.findIndex(producto=>producto.idproducto==this.producto.idproducto);
                proveedor[index] = this.producto;
            } else if( this.producto.accion=="eliminar" ){
                let index = proveedor.findIndex(producto=>producto.idproducto==this.producto.idproducto);
                proveedor.splice(index,1);
            }
            localStorage.setItem('proveedor', JSON.stringify(proveedor));
            this.nuevoproducto();
            this.obtenerproveedor();
            this.producto.msg = 'producto procesado con exito';
        },
        obtenerproveedor(valor=''){
            this.proveedor = [];
            let proveedor = JSON.parse(localStorage.getItem('proveedor')) || [];
            this.proveedor = proveedor.filter(producto=>producto.nombre.toLowerCase().indexOf(valor.toLowerCase())>-1);
        },
        nuevoproducto(){
            this.producto.accion = 'nuevo';
            this.producto.msg = '';
            this.producto.idproducto = '';
            this.producto.codigo = '';
            this.producto.nombre = '';
            this.producto.direccion = '';
            this.producto.telefono = '';
            this.producto.dui = '';
        }
    },
    created(){
        this.obtenerproveedor();
    },
    template:`
        <div id="appCiente">
            <div class="card text-white" id="carproducto">
                <div class="card-header bg-primary">
                    Registro de proveedor
                    <button type="button" class="btn-close text-end" data-bs-dismiss="alert" data-bs-target="#carproducto" aria-label="Close"></button>
                </div>
                <div class="card-body text-dark">
                    <form method="post" @submit.prevent="guardarproducto" @reset="nuevoproducto">
                        <div class="row p-1">
                            <div class="col col-md-2">Codigo:</div>
                            <div class="col col-md-2">
                                <input title="Ingrese el codigo" v-model="producto.codigo" pattern="[0-9]{3,10}" required type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Nombre:</div>
                            <div class="col col-md-3">
                                <input title="Ingrese el nombre" v-model="producto.nombre" pattern="[A-Za-zñÑáéíóúü ]{3,75}" required type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Direccion:</div>
                            <div class="col col-md-3">
                                <input title="Ingrese la direccion" v-model="producto.direccion" pattern="[A-Za-zñÑáéíóúü ]{3,100}" required type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Telefono:</div>
                            <div class="col col-md-2">
                                <input title="Ingrese el tel" v-model="producto.telefono" pattern="[0-9]{4}-[0-9]{4}" required type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">DUI:</div>
                            <div class="col col-md-2">
                                <input title="Ingrese el DUI" v-model="producto.dui" pattern="[0-9]{8}-[0-9]{1}" required type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-5 text-center">
                                <div v-if="producto.mostrar_msg" class="alert alert-primary alert-dismissible fade show" role="alert">
                                    {{ producto.msg }}
                                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                </div>
                            </div>
                        </div>
                        <div class="row m-2">
                            <div class="col col-md-5 text-center">
                                <input class="btn btn-success" type="submit" value="Guardar">
                                <input class="btn btn-warning" type="reset" value="Nuevo">
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="card text-white" id="carBuscarproducto">
                <div class="card-header bg-primary">
                    Busqueda de proveedor
                    <button type="button" class="btn-close" data-bs-dismiss="alert" data-bs-target="#carBuscarproducto" aria-label="Close"></button>
                </div>
                <div class="card-body">
                    <table class="table table-dark table-hover">
                        <thead>
                            <tr>
                                <th colspan="6">
                                    Buscar: <input @keyup="buscandoproducto" v-model="buscar" placeholder="buscar aqui" class="form-control" type="text" >
                                </th>
                            </tr>
                            <tr>
                                <th>CODIGO</th>
                                <th>NOMBRE</th>
                                <th>DIRECCION</th>
                                <th>TEL</th>
                                <th>DUI</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in proveedor" @click='modificarproducto( item )' :key="item.idproducto">
                                <td>{{item.codigo}}</td>
                                <td>{{item.nombre}}</td>
                                <td>{{item.direccion}}</td>
                                <td>{{item.telefono}}</td>
                                <td>{{item.dui}}</td>
                                <td>
                                    <button class="btn btn-danger" @click="eliminarproducto(item)">Eliminar</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `
});