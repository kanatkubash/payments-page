declare var Handlebars: any;
var entryDiv: HTMLElement;
var template: Function;
type Db = typeof data;
type State = ReturnType<typeof makeState>;
var state: State;
const DISABLED = "disabled";

var $ = document.querySelector.bind(document);
entryDiv = $("#main");

Handlebars.registerHelper("date", (date) =>
  date.toISOString().substring(0, 10)
);
Handlebars.registerPartial("payment", $("#payment-template").innerHTML);
Handlebars.registerPartial(
  "verificationGroup",
  $("#verification-template").innerHTML
);
Handlebars.registerPartial("invoice", $("#invoice-template").innerHTML);
Handlebars.registerPartial(
  "paymentHeader",
  $("#payment-header-template").innerHTML
);
Handlebars.registerPartial(
  "invoiceHeader",
  $("#invoice-header-template").innerHTML
);
Handlebars.registerPartial(
  "verificationHeader",
  $("#verification-header-template").innerHTML
);

template = Handlebars.compile(entryDiv.innerHTML.replace(/&gt;/g, ">"));
state = makeState(data);
render();

function makeState(data: Db) {
  var paymentsById = data.payments.reduce((acc, payment) => {
    acc[payment.id] = payment;
    return acc;
  }, {});
  var invoicesById = data.invoices.reduce((acc, invoice) => {
    acc[invoice.id] = invoice;
    return acc;
  }, {});

  var surplusDeficitVerificationsGroups = data.verificationGroups
    .filter((group) => group.value != 0)
    .map((group) => {
      group.invoices = data.verificationGroupEntries
        .filter((entry) => entry.groupId == group.id && entry.type == "invoice")
        .map((entry) => invoicesById[entry.verificationId]);

      group.payments = data.verificationGroupEntries
        .filter((entry) => entry.groupId == group.id && entry.type == "payment")
        .map((entry) => paymentsById[entry.verificationId]);

      group.licensePlate = group.invoices
        .map((invoice) => invoice.licensePlate)
        .join(", ");

      group.invoiceNumber = group.invoices
        .map((invoice) => invoice.invoiceNumber)
        .join(", ");

      group.company = [
        ...new Set(group.invoices.map((invoice) => invoice.consumer)),
      ].join(", ");

      return group;
    });

  var unmatchedPayments = data.payments.filter(
    (payment) =>
      !data.verificationGroupEntries.find(
        (entry) => entry.verificationId == payment.id && entry.type == "payment"
      )
  );

  var unpaidInvoices = data.invoices.filter(
    (invoice) =>
      !data.verificationGroupEntries.find(
        (entry) => entry.verificationId == invoice.id && entry.type == "invoice"
      )
  );

  return {
    surplusDeficitVerificationsGroups,
    unmatchedPayments,
    unpaidInvoices,
    selected: {
      surplusDeficitVerificationsGroups: [],
      unmatchedPayments: [],
      unpaidInvoices: [],
    },
    cantMerge: DISABLED,
  };
}

function notEmptyCount() {
  return Object.values(state.selected).reduce(
    (acc, array) => acc + Number(array.length != 0),
    0
  );
}

function toggleSelectInvoice(invoiceId) {
  if (notEmptyCount() == 2 && state.selected.unpaidInvoices.length == 0) return;

  toggleSelect("unpaidInvoices", invoiceId);
}

function toggleSelectPayment(paymentId) {
  if (notEmptyCount() == 2 && state.selected.unmatchedPayments.length == 0)
    return;

  toggleSelect("unmatchedPayments", paymentId);
}

/**
 *
 * @param verificationGroupId So far only one verification group can be selected
 * @returns
 */
function toggleSelectVerification(verificationGroupId) {
  var { surplusDeficitVerificationsGroups } = state.selected;
  if (
    surplusDeficitVerificationsGroups.length != 0 &&
    surplusDeficitVerificationsGroups[0].id != verificationGroupId
  )
    return;

  if (
    notEmptyCount() == 2 &&
    state.selected.surplusDeficitVerificationsGroups.length == 0
  )
    return;

  toggleSelect("surplusDeficitVerificationsGroups", verificationGroupId);
}

function toggleSelect(type, itemId) {
  var verification = state[type].find((item) => item.id == itemId);

  verification.isSelected = !verification.isSelected;
  state.selected[type] = state[type].filter((item) => item.isSelected);
  decideMergability();

  render();
}

function expandVerification(verificationGroupId) {
  var verificationGroup = state.surplusDeficitVerificationsGroups.find(
    (item) => item.id == verificationGroupId
  );
  verificationGroup.expanded = !verificationGroup.expanded;

  render();
}

function decideMergability() {
  var notEmpty = notEmptyCount();
  var canMerge = notEmpty > 1;
  state.cantMerge = canMerge ? "" : DISABLED;

  /// check for auto merge without confirm
  if (notEmpty == 2) merge(true);
}

function merge(onlyIfAmountZero = false) {
  var { surplusDeficitVerificationsGroups, unpaidInvoices, unmatchedPayments } =
    state.selected;

  var isSurplusSelected = surplusDeficitVerificationsGroups.length != 0;
  var isInvoicesSelected = unpaidInvoices.length != 0;
  var leftSide = [];
  var rightSide = [];

  var amount = 0;
  if (isSurplusSelected) {
    leftSide = surplusDeficitVerificationsGroups;
    rightSide = isInvoicesSelected ? unpaidInvoices : unmatchedPayments;
    amount =
      leftSide[0].value +
      rightSide.reduce((acc, { payAmount }) => acc + payAmount, 0);
  } else {
    leftSide = unpaidInvoices;
    rightSide = unmatchedPayments;
    amount =
      rightSide.reduce((acc, { payAmount }) => acc + payAmount, 0) +
      leftSide.reduce((acc, { payAmount }) => acc + payAmount, 0);
  }
  //   debugger;
  if ((onlyIfAmountZero && amount == 0) || !onlyIfAmountZero) {
    var verifications;
    var groupId;

    if (isSurplusSelected) {
      var group = data.verificationGroups.find(
        ({ id }) => surplusDeficitVerificationsGroups[0].id == id
      );
      group.value = amount;

      verifications = isInvoicesSelected ? unpaidInvoices : unmatchedPayments;
      groupId = group.id;
    } else {
      groupId =
        data.verificationGroups[data.verificationGroups.length - 1].id + 1;
      data.verificationGroups.push({ id: groupId, value: amount });

      verifications = [...unpaidInvoices, ...unmatchedPayments];
    }

    var newEntries = verifications.map(({ id, consumer }) => ({
      groupId,
      type: consumer ? "invoice" : "payment",
      verificationId: id,
    }));

    data.verificationGroupEntries.push(...newEntries);
    state = makeState(data);
    Object.values(data).forEach((arr) =>
      arr.forEach((item) => (item.isSelected = false))
    );
  }

  render();
}

function render() {
  entryDiv.innerHTML = template(state);
}

Object.assign(window, {
  expandVerification,
  decideMergability,
  toggleSelect,
  toggleSelectInvoice,
  toggleSelectPayment,
  toggleSelectVerification,
  merge,
  state,
});
