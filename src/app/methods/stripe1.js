//
// function SS_ProductCheckout(baseUrl, userEmail, productId) {
//   localStorage.setItem('strapiStripeUrl', baseUrl);
//   const getProductApi = baseUrl + 'strapi-stripe/getProduct/' + productId;
//   const checkoutSessionUrl = baseUrl + 'strapi-stripe/createCheckoutSession';
//
//   fetch(getProductApi, {
//     method: 'get',
//     mode: 'cors',
//     headers: new Headers({
//       'Content-Type': 'application/json',
//     })
//   })
//     .then(response => response.json())
//     .then(response => {
//       fetch(checkoutSessionUrl, {
//         method: 'post',
//         body: JSON.stringify({
//           stripePriceId: response.stripePriceId,
//           stripePlanId: response.stripePlanId,
//           isSubscription: response.isSubscription,
//           productId: response.id,
//           productName: response.title,
//           userEmail,
//           locale: 'de'
//         }),
//         mode: 'cors',
//         headers: new Headers({
//           'Content-Type': 'application/json',
//         }),
//       })
//         .then(response => response.json())
//         .then(response => {
//           if (response.id) {
//             window.location.replace(response.url);
//           }
//         });
//     });
// }
//
// function SS_GetProductPaymentDetails(checkoutSessionId, baseUrl) {
//   const retrieveCheckoutSessionUrl =
//     baseUrl + 'strapi-stripe/retrieveCheckoutSession/' + checkoutSessionId;
//   return fetch(retrieveCheckoutSessionUrl, {
//     method: 'get',
//     mode: 'cors',
//     headers: new Headers({
//       'Content-Type': 'application/json',
//     }),
//   })
//     .then(response => response.json())
//     .then(response => {
//       if (response.payment_status === 'paid') {
//         if (
//           window.performance
//             .getEntriesByType('navigation')
//             .map((nav: any) => nav?.type)
//             .includes('reload')
//         ) {
//           return response;
//         } else {
//           // store payment in strapi
//           const stripePaymentUrl = baseUrl + 'strapi-stripe/stripePayment';
//           fetch(stripePaymentUrl, {
//             method: 'post',
//             body: JSON.stringify({
//               txnDate: new Date(),
//               transactionId: response.id,
//               isTxnSuccessful: true,
//               txnMessage: response,
//               txnAmount: response.amount_total / 100,
//               customerName: response.customer_details.name,
//               customerEmail: response.customer_details.email,
//               stripeProduct: response.metadata.productId,
//             }),
//             mode: 'cors',
//             headers: new Headers({
//               'Content-Type': 'application/json',
//             }),
//           });
//         }
//
//         return response;
//       }
//     });
// }
//
// function getProductStripeApi (productId, base_url) {
//   const product_url =  `${base_url}strapi-stripe/getProduct/${productId}`;
//
//   return fetch(product_url, {
//     method: 'get',
//     mode: 'cors',
//     headers: new Headers({
//       'Content-Type': 'application/json',
//     })
//   }).then(response => response.json())
// }
//
// window.addEventListener('message', (event) => {
//   console.log('custom event', event);
//   if(event.name === 'getProductStripeApi') {
//     getProductStripeApi(event.data.productId, event.data.baseUrl).then();
//   }
//   if(event.name === 'getProductPaymentDetails') {
//     SS_GetProductPaymentDetails(event.data.checkoutSessionId, event.data.baseUrl).then();
//   }
//   if(event.name === 'productCheckout') {
//     SS_ProductCheckout(event.data.baseUrl, event.data.userEmail, event.data.productId);
//   }
// })
