$(document).ready(function(){
    var $body = $('body')
    reloadTable()
    shortcutHandler()
    
    $body.on('click', '.nav-link', function(e){
        e.preventDefault()
        $('#modal-cadastrar').modal('show')
        $('#modal-cadastrar .descricao').val('')
    })
    
    $body.on('click', '.delete-item', function(e){
        e.preventDefault()
        var thisId = $(this).data('id')
        swal({
            title: "Deseja deletar esse produto?",
            text: "Essa opção não pode ser desfeita",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                apiRequests('', 'DELETE', thisId)
                addToTable(apiRequests('', 'GET'))
                swal("O produto foi deletado!", {
                    icon: "success",
                });
            }
        });
    })
    
    $body.on('click', '.edit-item', function(e){
        e.preventDefault()
        var thisId = $(this).data('id')
        data = apiRequests('', 'GET', thisId)
        $('#modal-edit #descricao').val(data.descricao)
        $('#modal-edit #id-produto').val(data._id)
        $('#modal-edit').modal('show')
    })
    
    $body.on('click', '.modal-save', function(e){
        e.preventDefault()
        var thisId = $('#modal-edit #id-produto').val(),
        descricaoInput = $('#modal-edit #descricao').val()
        
        data = apiRequests({descricao: descricaoInput}, 'PUT', thisId)
        reloadTable()
        $('#modal-edit').modal('hide')
    })
    
    $body.on('click', '.modal-create', function(e){
        e.preventDefault()
        var thisId = $('#modal-cadastrar .id-produto').val(),
        descricaoInput = $('#modal-cadastrar .descricao').val()
        
        data = apiRequests({descricao: descricaoInput}, 'POST', thisId)
        reloadTable()
        $('#modal-cadastrar').modal('hide')
    })
})

function apiRequests(data, method = "GET", id =0 ){
    let url = "http://18.231.42.102:3000/api/produtos",
    returnData = {}
    if(id != 0){
        url+= "/"+ id
    }
    var settings = {
        "url": url,
        "method": method,
        "timeout": 0,
        "async": false,
        "headers": {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        "data": data
    };
    
    $.ajax(settings).done(function (response) {
        returnData = response;
    });
    return returnData
}

function addToTable(data){
    html = ""
    $.each(data, function(index, item){
        let $template = $('#table-row').html()
        $template = $template.replace(/{{id}}/gm, item._id)
        $template = $template.replace(/{{descricao}}/gm, item.descricao)
        $template = $template.replace(/{{index}}/gm, index + 1)
        html += $template
    })
    $("#list-table tbody").html(html)
    $("#list-table tbody").find('tr:first').attr('focus', 'true')
}

function reloadTable(){
    data = apiRequests('', 'GET')
    addToTable(data)
}

function shortcutHandler(){
    window.onkeydown= function(keyEvent){
        let keyCodeNumber = keyEvent.keyCode
        if(keyCodeNumber == 40){
            tableLineFocus('down')
        }
        if(keyCodeNumber == 38){
            tableLineFocus('up')
        }
        if(keyEvent.ctrlKey && keyCodeNumber == 67)
        {
            keyEvent.preventDefault()
            keyEvent.stopPropagation()
            $('#new-entry').click()
        }

        if(keyEvent.ctrlKey && keyCodeNumber == 68)
        {
            keyEvent.preventDefault()
            keyEvent.stopPropagation()
            $('tr[focus=true]').find('.delete-item').click()
        }

        if(keyEvent.ctrlKey && keyCodeNumber == 69)
        {
            keyEvent.preventDefault()
            keyEvent.stopPropagation()
            $('tr[focus=true]').find('.edit-item').click()
        }
    }
}

function tableLineFocus(direction){
    let $focusLine = $("#list-table tbody").find('tr[focus=true]')
    if(direction == 'down' && $focusLine.next('tr').length != 0){
        $("#list-table tbody").find('tr[focus=true]').attr('focus', 'false').next('tr').attr('focus', 'true')
    }else if(direction == 'up' && $focusLine.prev('tr').length != 0){
        $("#list-table tbody").find('tr[focus=true]').attr('focus', 'false').prev('tr').attr('focus', 'true')
    }
}