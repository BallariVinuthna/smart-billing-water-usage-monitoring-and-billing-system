import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
    action: { type: String, required: true }, // e.g. "USER_LOGIN", "BILL_GENERATED"
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    details: { type: Object }, // JSON details about the action
    ipAddress: { type: String },
    createdAt: { type: Date, default: Date.now },
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
