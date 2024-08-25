module.exports = {
    port: process.env.PORT || 3000,
    stateMachineTimeout: parseInt(process.env.STATE_MACHINE_TIMEOUT, 10) || 10000,
    stateMachinePurchaseCount: parseInt(process.env.STATE_MACHINE_PURCHASE_COUNT, 10) || 2,
};
