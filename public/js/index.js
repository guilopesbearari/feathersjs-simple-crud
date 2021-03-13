var socket = io('http://localhost:3030');
var app = feathers();
app.configure(feathers.socketio(socket));

$("#modificar").hide()

async function carregarDados () {
  const result = await app.service('products').find({
    query: {
      $sort: {
        name: 1
      }
    }
  })
  $("#tabela > tbody").empty()
  result.forEach(el => {
    $("#tabela > tbody").append(`
      <tr>
        <td>${el.name}</td>
        <td>${el.description}</td>
        <td>${el.price}</td>
        <td>
          <button class="btn btn-danger" id="${el.id}" value="Excluir" onClick="javascript:excluir(this.id)">
            <i class="fas fa-trash"></i>
          </button>
          <button class="btn btn-info" id="${el.id}" value="Editar" onClick="javascript:editar(this.id)">
            <i class="fas fa-edit"></i>
          </button>
        </td>
      </tr>
    `)
  })
}

carregarDados()

async function excluir(id) {
  await app.service('products').remove(id)
  $.notify("Produto excluído", "success")
  await carregarDados()
}

async function editar(id) {
  const result = await app.service('products').get(id)
  $("#id").val(id)
  $("#name").val(result.name)
  $("#description").val(result.description)
  $("#price").val(result.price)
  $("#modificar").show()
  $("#salvar").hide()
}

async function atualizar() {
  await app.service('products').update($("#id").val(), {
    name: $('#name').val(),
    description: $('#description').val(),
    price: $('#price').val()
  })
  $('#form').trigger("reset");
  $("#modificar").hide()
  $("#salvar").show()
  $.notify("Produto atualizado", "success")
  await carregarDados()
}

async function cadastrar() {
  await app.service('products').create({
    name: $('#name').val(),
    description: $('#description').val(),
    price: $('#price').val()
  })
  $('#form').trigger("reset");
  $.notify("Produto salvo", "success")
  await carregarDados()
}
