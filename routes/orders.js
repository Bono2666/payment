let express = require('express');
let router = express.Router();
let Order = require('../models/orders');

const midtransClient = require('midtrans-client');
// Create Core API instance
let coreApi = new midtransClient.CoreApi({
        isProduction : false,
        serverKey : 'SB-Mid-server-onAijqUJM0yUU-OlCtQfdxQU',
        clientKey : 'SB-Mid-client-bk_eM__M2XXPIA-g'
    });

/* GET orders listing. */
router.get('/', function(req, res, next) {
  Order.findAll().then(order => {
    let _data = order.map((item) => {
      return {
        id: item.id,
        phone: item.phone,
        order_date: item.order_date,
        meeting_date: item.meeting_date,
        complaint: item.complaint,
        class_id: item.class_id,
        status: item.status,
        response_midtrans: JSON.parse(item.response_midtrans),
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }
    });
    res.json({
      status: true,
      message: "Orders retrieved successfully",
      data: _data,
    });
  }).catch(err => {
    res.json({
      status: false,
      message: "Orders not retrieved successfully" + err,
      data: {},
    });
  });
});

// Add new order with midtrans
router.post('/', function(req, res, next) {
  coreApi.charge(req.body)
    .then((chargeResponse)=>{
      let order = {
        id: chargeResponse.order_id,
        phone: req.body.phone,
        order_date: req.body.order_date,
        meeting_date: req.body.meeting_date,
        complaint: req.body.complaint,
        class_id: req.body.class_id,
        status: chargeResponse.transaction_status,
        response_midtrans: JSON.stringify(chargeResponse),
      };

      Order.create(order).then(order => {
        res.json({
          status: true,
          message: "Order added successfully",
          data: order,
        });
      }).catch(err => {
        res.json({
          status: false,
          message: "(Create) Order not added successfully. " + err,
          data: {},
        });
      });

    })
    .catch((e)=>{
      res.json({
        status: false,
        message: "(Charge) Order not added successfully. " + e.message,
        data: req.body,
      });
    });
});

// Update response_midtrans from midtrans notification
router.post('/notification', function(req, res, next) {
  coreApi.transaction.notification(req.body).then((statusResponse)=>{
    let _id = statusResponse.order_id;
    let response = JSON.stringify(statusResponse);

    Order.update({
      status: statusResponse.transaction_status,
      response_midtrans: response
    }, {
      where: {
        id: _id
      }
    }).then(() => {
      res.json({
        status: true,
        message: "Order status updated successfully",
        data: []
      });
    }).catch(err => {
      res.status(500).json({
        status: false,
        message: "Order status not updated successfully. " + err,
        data: []
      });
    });
  });
});

// Update response_midtrans by id
router.get('/status/:id', function(req, res, next) {
  let _id = req.params.id;
  coreApi.transaction.status(_id).then((statusResponse)=>{
    let response = JSON.stringify(statusResponse);

    Order.update({
      status: statusResponse.transaction_status,
      response_midtrans: response
    }, {
      where: {
        id: _id
      }
    }).then(() => {
      res.json({
        status: true,
        message: "Order status updated successfully",
        data: statusResponse
      });
    }).catch(err => {
      res.status(500).json({
        status: false,
        message: "Order status not updated successfully. " + err,
        data: []
      });
    });
  });
});

module.exports = router;
