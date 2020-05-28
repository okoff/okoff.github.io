function test() {
    const tableEl = $("#plan_table");
    const tableElem = $("#WC_table");
    let data;
    let data1;
    let log = '';
    if ($('#v').is(':checked')) {
        $('div.hidden').removeClass('hidden').addClass('nothidden')
    }
    let scriptname = $("#module").val();
//    scriptname = 'http://localhost:5000/' + scriptname;
    $.getScript(scriptname)
        .done(function(script, textStatus) {
            log = log + 'Функция планирования загружена успешно\n'
            document.getElementById('log').value = log
        })
        .fail(function(jqxhr, settings, exception) {
            log = log + 'Не удалось загрузить функцию планирования:\n' + exception;
            document.getElementById('log').value = log
        })
    let plan_name = $('#plan').val();
 //   plan_name = 'http://localhost:5000/' + plan_name;
    axios
        .get(plan_name)
        .then(({ data: dataFromServer }) => {
            data = dataFromServer.param;
            createTable_1(data, tableEl);
            //console.log(data)
            log = log + '\nКонтрольный пример объемного плана загружен\n'
            document.getElementById('log').value = log;
        })
        .catch(error => {
            log = log + '\nНе удалось загрузить контрольный пример объемного плана\n'
            document.getElementById('log').value = log
        })

    let wc_name = $('#wc_list').val();
    wc_name = 'http://localhost:5000/' + wc_name;
    console.log(wc_name)
    axios
        .get(wc_name)
        .then(({ data: dataFromServer }) => {
            data = dataFromServer.otvet;
            console.log(data);
            //console.log(JSON.stringify(wc_list_l.responseJSON.otvet))
            log = log + '\nКонтрольный пример ответа от РЦ загружен\n';
            document.getElementById('log').value = log;
            createTable_2(data, tableElem)
        })
        .catch(error => {
            log = log + '\nНе удалось загрузить контрольный пример ответа от РЦ\n'
            document.getElementById('log').value = log
        })

    log = ''
}

function createTable_1(data, tableEl) {
    tableEl.empty();
    data.forEach(
        ({
            DT,
            Q,
            T,
            D,
            P
        }) => {
            tableEl.append(`
                      <tr class="${status ? 'status-true' : ''}">
                          <td>${DT}</td>
                          <td>${Q}</td>
                          <td>${T}</td>
                          <td>${D}</td>
                          <td>${P}</td>
                      </tr>
                    `);
        })
}

function createTable_2(data, tableElem) {
    tableElem.empty();
    data.forEach(
        ({
            id,
            WC,
            PL,
            DT,
            OP,
            Q,
            T,
            D,
            P
        }) => {
            tableElem.append(`
                      <tr class="${status ? 'status-true' : ''}">
                          <td>${id}</td>
                          <td>${WC}</td>
                          <td>${PL}</td>
                          <td>${DT}</td>
                          <td>${OP}</td>
                          <td>${Q}</td>
                          <td>${T}</td>
                          <td>${D}</td>
                          <td>${P}</td>
                      </tr>
                    `);
        })
}