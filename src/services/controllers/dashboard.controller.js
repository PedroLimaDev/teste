const db = require("../api/sConfig");
const sequelize = require("../api/sConfig");
const { QueryTypes } = require('sequelize');
const Op = db.Sequelize.Op;
const Queries = require("../api/queries")
var groupArray = require('group-array');

function findTable(id) {
  if(id < 10) {
    var table = `fato_00${id}`
    var from = `public`
  }
  else if(id < 100) {
    var table = `fato_0${id}`
    var from = `public` 
  }
  else if (id < 1000) {
    var table = `fato_${id}`
    var from = `public`
  }
  else if (id < 10000) {
    var table = `t00${id}`
    var from = `fato`
  }
  else if (id < 100000) {
    var table = `t0${id}`
    var from = `fato`
  }
  else {
    var table = `t${id}`
    var from = `fato`
  }

  return `${from}.${table}`
}

exports.show = async (req, res) => {
  const id = req.body.id;
  const cd = req.body.cd;
  const time = req.body.time;
  
  let table = findTable(id)

  const receber = Queries.receber(table, cd, 30)
  const venda = Queries.venda(table, cd, time)
  const concTaxas = Queries.concTaxas(table, cd, time)
  const resumoVendas = Queries.resumoVendas(table, cd, time)
  const cancelamentos = Queries.cancelamentos(id, time)
  const requests = Queries.requests(cd, id, time)
  //const pagamento = Queries.pagamento(from, table, cd, time)
  //const vendaPlano = Queries.vendaPlano(from, table, cd, time)
  //const vendaAdquirente = Queries.vendaAdquirente(from, table, cd, time)
  //const concVendas = Queries.concVendas(from, table, cd, time)
  
  let vendasHome
  let ticketMedio
  let vendasList
  let vendasGraph
  let vendasV2
  let vendasDatas

  let receberHome
  let receberHoje
  let receber30
  let receberList
  let receberGraph
  let receberDataset

  let taxasList
  let redesList

  let cancelList

  let requestList

  let dataset
  let dataset2

  const vendaQuery = await db.sequelize.query(venda)
    .then(vendaData => {
      vendasList = vendaData[0]
      //console.log(vendaData[0])
      ticketMedio = calcTicket(vendaData[0])
      vendasHome = somaV2(vendaData[0])
      vendasGraph = prepareGraphVendasV2(vendaData[0])

    })
    .then(async () => {
      const receberQuery = await db.sequelize.query(receber)
      .then(receberData => {
        receberList = receberData[0]
        //console.log(receberList)
        receberHome = somaReceberV2(receberData[0], 7)
        receberHoje = somaReceberV2(receberData[0], 1)
        receber30 = somaReceberV2(receberData[0], 30)
        receberGraph = prepareGraphReceberV2(receberData[0], 7)
        receberDataset = prepareDatasetReceber(receberData[0])
      })
      .then(async () => {
        const TaxaQuery = await db.sequelize.query(concTaxas)
        .then(taxaData => {
          redesList = mapRedes(taxaData[0])
          taxasList = taxaData[0] 
        })
        .then(async () => {
          const CancelQuery = await db.sequelize.query(cancelamentos)
          .then(cancelData => {
            cancelList = cancelData[0] 
          })
          .then(async () => {
            const RequestQuery = await db.sequelize.query(requests)
            .then(requestData => {
              //console.log(requestData)
              requestList = requestData[0] 
            })
          .then(async () => {
            const ResumoVendasQueryDate = await db.sequelize.query(resumoVendas)
            .then(resumoData => {
              dataset = prepareDataset(resumoData[0])
              dataset2 = prepareDataset2(resumoData[0])
            })
              .then(async () =>{
                res.send({
                  vendas: vendasList,
                  vendasHome: vendasHome,
                  ticketMedio: ticketMedio,
                  vendasGraph: vendasGraph,
                  receber: receberList,
                  receberHome: receberHome,
                  receberHoje: receberHoje,
                  receber30: receber30,
                  receberGraph: receberGraph,
                  taxas: taxasList,
                  redes: redesList,
                  cancelamentos: cancelList,
                  requests: requestList,
                  dataset: dataset,
                  dataset2: dataset2,
                  receberDataset:receberDataset
                })
              })
            })
          })
        })
      })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send({
        message: "Error retrieving data",
      });
    })
}

exports.taxDate = async (req, res) => { 
  const id = req.body.id;
  const cd = req.body.cd;
  const time = req.body.time;

  let table = findTable(id)
  let taxasList
  const concTaxas = Queries.concTaxas(table, cd, time)
  
  const TaxaQueryDate = await db.sequelize.query(concTaxas)
    .then(taxaData => {
      redesList = mapRedes(taxaData[0])
      taxasList = taxaData[0]   
    })
    .then(async () =>{
      res.send({
        taxas: taxasList,
        redes: redesList,
      })
    })
}

exports.cancelDate = async (req, res) => { 
  const id = req.body.id;
  const time = req.body.time;

  //let table = findTable(id)
  let cancelList
  const cancelamentos = Queries.cancelamentos(id, time)
  
  const CancelQueryDate = await db.sequelize.query(cancelamentos)
    .then(cancelData => {
      cancelList = cancelData[0]   
    })
    .then(async () =>{
      res.send({
        cancelamentos: cancelList,
      })
    })
}

exports.graphDate = async (req, res) => { 
  const id = req.body.id;
  const cd = req.body.cd;
  const time = req.body.time;

  let dataset
  let table = findTable(id)
  const resumoVendas = Queries.resumoVendas(table, cd, time)
  
  const ResumoVendasQueryDate = await db.sequelize.query(resumoVendas)
    .then(vendaData => {
      dataset = prepareDataset(vendaData[0])
      dataset2 = prepareDataset2(vendaData[0])
    })
    .then(async () =>{
      res.send({
        dataset: dataset,    
        dataset2: dataset2,    
      })
    })
}

function addDate(date) {
  const addDays = require('date-fns/addDays')
  let now = addDays(new Date(), date)
  now.setUTCHours(0,0,0,0)
  return now
}

function subDate(date) {
  const subDays = require('date-fns/subDays')
  let now = subDays(new Date(), date)
  now.setUTCHours(0,0,0,0)
  return now
}

function formatDate(date) {
  var dateParts = date.split("/");
  var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]); 

  return dateObject
}

function somaV2(data, time) {
  let date = subDate(time)
  //console.log(data)

  let soma = 0
  let quantidade = 0

  data.map((e) => {
    //let auxDate = new Date(e.datavenda)
    //if(auxDate <= date) {
      soma += parseFloat(e.valor)
      quantidade += parseInt(e.quantidade)
    //}
    // if(e.datavenda >= date)
    //   soma = parseFloat(e.valor)
  })

  return {soma: fixFloat(soma), quantidade: quantidade}
}

function calcTicket(vendas) {
  let ticket
  let somaValor = 0
  let somaQuant = 0

  vendas.map((e) => {
    somaValor += parseFloat(e.valor)
    somaQuant += parseInt(e.quantidade)
  })

  ticket = parseFloat((somaValor / somaQuant).toFixed(2))
  console.log(ticket)

  return ticket
}

function somaReceberV2(data, time) {
  let date = addDate(time)

  //console.log(date)
  //console.log(data)

  let soma = 0
  let quantidade = 0

  data.map((e) => {
    //console.log(e)
    let auxDate = formatDate(e.datareceber)
    console.log(auxDate)
    if(auxDate <= date) {
      //console.log("Entrou")
      soma += parseFloat(e.valor)
      //quantidade += parseInt(e.quantidade)
    }
    // if(e.datavenda >= date)
    //   soma = parseFloat(e.valor)
  })

  return fixFloat(soma)
}

function prepareGraphVendasV2(data) {
  //console.log(data)
  let credito = 0
  let debito = 0
  let rotativo = 0
  let voucher = 0

  let now = generateDate();
  
  data.map((e) => {
    //let auxDate = new Date(e.datavenda)
    
    //if(auxDate >= date) {  
      if(e.nomenatureza == 'CRÉDITO')
      {
        if(e.plano == 1){
          rotativo += parseFloat(e.valor)
        }
        else{
          credito += parseFloat(e.valor)
        }
      }
      else if (e == "DÉBITO") {          
        debito += parseFloat(e.valor)
      }
      else {
        voucher += parseFloat(e.valor)
      }
    //}
  })

  let obj = [
    {Tipo:"CRÉDITO", Valor: fixFloat(credito)}, 
    {Tipo:"DÉBITO", Valor: fixFloat(debito)},
    {Tipo:"ROTATIVO", Valor: fixFloat(rotativo)},
    {Tipo:"VOUCHER", Valor: fixFloat(voucher)}
  ]

  return obj
}

function prepareGraphReceberV2(data, time) {
  //console.log(data)
  let credito = 0
  let debito = 0
  let rotativo = 0
  let voucher = 0

  //let now = generateDate();
  let date = addDate(time)

  data.map((e) => {
    let auxDate = new Date(e.datareceber)
    
    if(auxDate <= date) {  
      if(e.nomenatureza == 'CRÉDITO')
      {
        if(e.plano == 1){
          rotativo += parseFloat(e.valor)
        }
        else{
          credito += parseFloat(e.valor)
        }
      }
      else if (e == "DÉBITO") {          
        debito += parseFloat(e.valor)
      }
      else {
        voucher += parseFloat(e.valor)
      }
    }
  })

  let obj = [
    {Tipo:"CRÉDITO", Valor: fixFloat(credito)}, 
    {Tipo:"DÉBITO", Valor: fixFloat(debito)},
    {Tipo:"ROTATIVO", Valor: fixFloat(rotativo)},
    {Tipo:"VOUCHER", Valor: fixFloat(voucher)}
  ]

  return obj
}

function taxQuantidade(data, time) {
  let date = findDate(time)

  let quantidade = 0

  data.map((e) => {
    let auxDate = new Date(e.datavenda)
    if(auxDate >= date) {
      quantidade += parseInt(e.quantidade)
    }
  })

  return quantidade
}

function groupData(data) {
  let arr

  data.reduce(function(acc, act)  {
    if(act.datavenda != acc.datavenda) {
      arr.push(aux)
    }
  })

  return arr
}

function mapRedes(arr) {
  let redes = []
  arr.map((r) => {
    if(!redes.includes(r.nomerede))
      redes.push(r.nomerede)
  })

  return redes
} 

function generateDate() {
  let today = new Date();
  let date=( today.getFullYear() +
             "-" + (parseInt(today.getMonth()+1).toString().padStart(2, "0")) + 
             "-" + today.getDate().toString().padStart(2, "0")); 
  return date;
}

function fixFloat(value){
  return parseFloat(value.toFixed(2))
}

function prepareDataset(obj) {
  let data = [];
  obj.map(e => {
    data.push(fixFloat(parseFloat(e.valor)))
  })

  return data
}

function prepareDataset2(obj) {
  let data = [];
  obj.map(e => {
    data.push({value:fixFloat(parseFloat(e.valor)), date:e.datavenda})
  })

  return data
}

function prepareDatasetReceber(obj) {
  let data = [];
  let now = addDate(7)
  console.log(`7 days ${now}`)

  obj.map(e => {
    let datesplit = e.datareceber.split('/')
    var dateObject = new Date(+datesplit[2], datesplit[1] - 1, +datesplit[0]); 

    if(dateObject <= now) {
      data.push({value:fixFloat(parseFloat(e.valor)), date:e.datareceber, bandeira:e.nomebandeira})
    }
  })

  return data
}


//VENDAS DO DIA CHEIO
// function somaVendas(data) {
//   let soma = 0;
    
//   for(let dia in data){
//     for(let rede in data[dia]){
//       for(let bandeira in data[dia][rede]){
//         for(let plano in data[dia][rede][bandeira]) {
//           for(let v in data[dia][rede][bandeira][plano]) {
//             soma += parseFloat(data[dia][rede][bandeira][plano][v].valor)
//           }
//         }
//       }
//     }
//   }

//   return fixFloat(soma)
// }

// function prepareGraphVendas(data) {
//   let credito = 0
//   let debito = 0
//   let rotativo = 0
//   let voucher = 0

//   let now = generateDate();

//   for(let dia in data){
//     for(let rede in data[dia]){
//       for(let bandeira in data[dia][rede]){
//         for(let plano in data[dia][rede][bandeira]) {
//           for(let v in data[dia][rede][bandeira][plano]) {
//             //console.log(data[dia][rede][bandeira][plano][v])
//             if(data[dia][rede][bandeira][plano][v].nomenatureza == 'CRÉDITO')
//             {
//               if(data[dia][rede][bandeira][plano][v].plano == 1){
//                 rotativo += parseFloat(data[dia][rede][bandeira][plano][v].valor)
//                 //console.log(rotativo)
//               }
//               else{
//                 credito += parseFloat(data[dia][rede][bandeira][plano][v].valor)
//                 //console.log(credito)
//               }
//             }
//             else if (data[dia][rede][bandeira][plano][v].nomenatureza == "DÉBITO") {          
//               debito += parseFloat(data[dia][rede][bandeira][plano][v].valor)
//               //console.log(debito)
//             }
//             else
//               voucher += parseFloat(data[dia][rede][bandeira][plano][v].valor)
//           }
//         }
//       }
//     }
//   }

//   let obj = [
//     {Tipo:"CRÉDITO", Valor: fixFloat(credito)}, 
//     {Tipo:"DÉBITO", Valor: fixFloat(debito)},
//     {Tipo:"ROTATIVO", Valor: fixFloat(rotativo)},
//     {Tipo:"VOUCHER", Valor: fixFloat(voucher)}
//   ]

//   return obj  
// }


//RECEBER DO DIA CHEIO
// function somaReceber(data) {
//   //let dia = generateDate();
//   //let dia = '2020-12-10';
//   let soma = 0;

//   for(let dia in data){
//     for(let rede in data[dia]){
//       for(let bandeira in data[dia][rede]){
//         for(let plano in data[dia][rede][bandeira]) {
//           for(let v in data[dia][rede][bandeira][plano]) {
//             soma += parseFloat(data[dia][rede][bandeira][plano][v].valor)
//           }
//         }
//       }
//     }
//   }

//   return fixFloat(soma)
// }

// function somaReceber30(data) {
//   //let dia = generateDate();
//   let soma = 0;

//   for(let dia in data) {
//     for(let rede in data[dia]){
//       for(let bandeira in data[dia][rede]){
//         for(let plano in data[dia][rede][bandeira]) {
//           for(let v in data[dia][rede][bandeira][plano]) {
//             soma += parseFloat(data[dia][rede][bandeira][plano][v].valor)
//           }
//         }
//       }
//     }
//   }

//   return parseFloat(soma.toFixed(2))
// }

// function prepareGraphReceber(data) {
//   let credito = 0
//   let debito = 0
//   let rotativo = 0
//   let voucher = 0

//   let dia = '2020-12-10';
//   let soma = 0;

//   for(let dia in data){
//     for(let rede in data[dia]){
//       for(let bandeira in data[dia][rede]){
//         for(let plano in data[dia][rede][bandeira]) {
//           for(let v in data[dia][rede][bandeira][plano]) {
//             if(data[dia][rede][bandeira][plano][v].nomenatureza == 'CRÉDITO')
//             {
//               if(data[dia][rede][bandeira][plano][v].plano == 1)
//                 rotativo += parseFloat(data[dia][rede][bandeira][plano][v].valor)
//               else
//                 credito += parseFloat(data[dia][rede][bandeira][plano][v].valor)
//             }
//             else if (data[dia][rede][bandeira][plano][v].nomenatureza == "DÉBITO")          
//               debito += parseFloat(data[dia][rede][bandeira][plano][v].valor)

//             else
//               voucher += parseFloat(data[dia][rede][bandeira][plano][v].valor)
//           }
//         }
//       }
//     }
// }

//   let obj = [
//     {Tipo:"CRÉDITO", Valor: fixFloat(credito)}, 
//     {Tipo:"DÉBITO", Valor: fixFloat(debito)},
//     {Tipo:"ROTATIVO", Valor: fixFloat(rotativo)},
//     {Tipo:"VOUCHER", Valor: fixFloat(voucher)}
//   ]

//   return obj  
// }

