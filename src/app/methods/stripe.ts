export function SS_ProductCheckout(productId: number, baseUrl: string, userEmail: string) {
  localStorage.setItem('strapiStripeUrl', baseUrl);
  const getProductApi = baseUrl + 'strapi-stripe/getProduct/' + productId;
  const checkoutSessionUrl = baseUrl + 'strapi-stripe/createCheckoutSession';

  fetch(getProductApi, {
    method: 'get',
    mode: 'cors',
    headers: new Headers({
      'Content-Type': 'application/json',
    })
  })
    .then(response => response.json())
    .then(response => {
      fetch(checkoutSessionUrl, {
        method: 'post',
        body: JSON.stringify({
          stripePriceId: response.stripePriceId,
          stripePlanId: response.stripePlanId,
          isSubscription: response.isSubscription,
          productId: response.id,
          productName: response.title,
          userEmail,
        }),
        mode: 'cors',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      })
        .then(response => response.json())
        .then(response => {
          console.log('response', response)
          if (response.id) {
            window.location.replace(response.url);
          }
        });
    });
}

export function SS_GetProductPaymentDetails(checkoutSessionId: string) {
  const baseUrl = localStorage.getItem('strapiStripeUrl');
  const retrieveCheckoutSessionUrl =
    baseUrl + 'strapi-stripe/retrieveCheckoutSession/' + checkoutSessionId;
  return fetch(retrieveCheckoutSessionUrl, {
    method: 'get',
    mode: 'cors',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  })
    .then(response => response.json())
    .then(response => {
      if (response.payment_status === 'paid') {
        if (
          window.performance
            .getEntriesByType('navigation')
            .map((nav: any) => nav?.type)
            .includes('reload')
        ) {
          return response;
        } else {
          // store payment in strapi
          const stripePaymentUrl = baseUrl + 'strapi-stripe/stripePayment';
           fetch(stripePaymentUrl, {
            method: 'post',
            body: JSON.stringify({
              txnDate: new Date(),
              transactionId: response.id,
              isTxnSuccessful: true,
              txnMessage: response,
              txnAmount: response.amount_total / 100,
              customerName: response.customer_details.name,
              customerEmail: response.customer_details.email,
              stripeProduct: response.metadata.productId,
            }),
            mode: 'cors',
            headers: new Headers({
              'Content-Type': 'application/json',
            }),
          });
        }

        return response;
      }
    });
}
