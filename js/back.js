let orderList = document.querySelector('.orderPage-table')
const token = `uLopoIL8QFOSUuMeMMQKB4MHVg62`
const delAllBtn = document.querySelector('.discardAllBtn')

// 計算營收比重
const columns = []
let cat1 = ['床架', 0]
let cat2 = ['收納', 0]
let cat3 = ['窗簾', 0]
function calculateMoney (orderAll) {
  cat1 = ['床架', 0]
  cat2 = ['收納', 0]
  cat3 = ['窗簾', 0]
  let productsAllArr = orderAll.map(e=>e.products)
  productsAllArr.forEach(e=> {
    e.forEach(item => {
      if(item.category === '床架'){
        cat1[1] += 1
      }else if (item.category === '收納'){
        cat2[1] += 1
      }else{
        cat3[1] += 1
      }
    })

  })
  console.log(cat1, cat2, cat3)
  columns.push(cat1)
  columns.push(cat2)
  columns.push(cat3)
  renderC3()
}

function renderC3 () {
  // C3.js
  let chart = c3.generate({
    bindto: '#chart', // HTML 元素綁定
    data: {
      type: "pie",
      columns: columns,
      colors:{
        "床架":"#DACBFF",
        "收納":"#9D7FEA",
        "窗簾": "#5434A7"
      }
    },
  });
}

// 取得訂單資料
let orderAll = []
const getOrderUrl = `https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/yu19941994/orders`
function initOrder () {
  axios.get(getOrderUrl, {headers: {'Authorization': token}})
    .then((res) => {
      orderAll = res.data.orders
      console.log(orderAll)
      renderOrderList(orderAll)
      calculateMoney (orderAll) 
    })
}

let orderContent = ''
let orderTempor = ''
function renderOrderList (orderAll) {
  orderContent = ''
  orderTempor = ''
  orderList.innerHTML = ''
  const orderHeader = `
    <thead>
          <tr>
            <th>訂單編號</th>
            <th>聯絡人</th>
            <th>聯絡地址</th>
            <th>電子郵件</th>
            <th>訂單品項</th>
            <th>訂單日期</th>
            <th>訂單狀態</th>
            <th>付款狀態</th>
            <th>付款</th>
            <th>操作</th>
          </tr>
        </thead>
  `
  orderAll.forEach(e => {
    orderContent = `
        <tr>
          <td>${e.id}</td>
          <td>
            <p>${e.user.name}</p>
            <p>${e.user.tel}</p>
          </td>
          <td>${e.user.address}</td>
          <td>${e.user.email}</td>
          <td>
            <p>${e.products.map(e=>e.title)}</p>
          </td>
          <td>${toDate(e.createdAt)}</td>
          <td class="orderStatus">
            <a href="#">未處理</a>
          </td>
          <td class="orderStatus">
            <p>${e.paid}</p>
          </td>
          <td>
            <input type="button" class="pay-Btn" value="付款" data-status="update" data-id="${e.id}">
          </td>
          <td>
            <input type="button" class="delSingleOrder-Btn" value="刪除" data-status="del" data-id="${e.id}">
          </td>
        </tr>
    `
    orderTempor += orderContent
    orderList.innerHTML = orderHeader + orderTempor
  })
}

// 轉換日期格式
function toDate (num) {
  return `${new Date(num*1000).getFullYear()} - ${new Date(num*1000).getMonth()+1}-${new Date(num*1000).getDate()}`
}

// 修改未處理狀態
const updateOrderUrl = `https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/yu19941994/orders`
function updateOrder (e) {
  if(e.target.getAttribute('data-status') === 'update'){
    axios.put(updateOrderUrl, {
      data: {
        id: e.target.getAttribute('data-id'),
        paid: true
      },
    },{headers: {'Authorization': token}})
      .then(res => {
        console.log(res.data)
        let orderUpdate = res.data.orders
        renderOrderList(orderUpdate)
      })
  }
}

orderList.addEventListener('click', updateOrder)

// 刪除全部訂單
const delAllUrl = `https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/yu19941994/orders`
function delOrderAll () {
  axios.delete(delAllUrl, {headers: {'Authorization': token}})
    .then(res => {
      console.log(res)
      const delAllOrder = []
      renderOrderList(delAllOrder)
      calculateMoney (orderAll) 
    })
}

delAllBtn.addEventListener('click', delOrderAll)



// 刪除單筆訂單
function delOrder (e) {
  if(e.target.getAttribute('data-status') === 'del'){
    axios.delete(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/yu19941994/orders/${e.target.getAttribute('data-id')}`,{headers: {'Authorization': token}})
      .then(res => {
        console.log(res)
        let delSingleOrder = res.data.orders
        renderOrderList(delSingleOrder)
        calculateMoney (delSingleOrder) 
      })
  }
}
 

orderList.addEventListener('click', delOrder)
initOrder()
