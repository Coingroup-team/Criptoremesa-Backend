# 📋 Module Reference Guide

## **🌟 Complete Module Inventory**

Comprehensive reference for all 25+ backend modules with their responsibilities and key endpoints.

---

## **🔐 Authentication & Security**

### **Authentication Module**

- **Purpose**: User login/logout, session management
- **Key Components**:
  - Login/logout endpoints
  - Session validation
  - Security logging
- **Database Functions**:
  - `sec_cust.fn_authenticate_user()`
  - `sec_cust.fn_validate_session()`

### **Users Module**

- **Purpose**: User profile management and operations
- **Key Components**:
  - Profile CRUD operations
  - User verification status
  - Notification preferences
- **Database Functions**:
  - `sec_cust.fn_get_user_info()`
  - `sec_cust.fn_update_user_profile()`

---

## **💰 Core Business Logic**

### **Remittances Module**

- **Purpose**: Complete remittance lifecycle management
- **Key Components**:
  - Pre-remittance creation
  - Queue-based processing
  - Payment gateway integration
  - Status tracking
- **Database Functions**:
  - `prc_mng.fn_create_pre_remittance()`
  - `ord_sch.fn_process_remittance()`
  - `ord_sch.fn_update_remittance_status()`

### **Rates Module**

- **Purpose**: Exchange rate management and calculations
- **Key Components**:
  - Real-time rate fetching
  - Commission calculations
  - Rate caching
- **Database Functions**:
  - `prc_mng.fn_get_exchange_rates()`
  - `prc_mng.fn_calculate_fees()`

### **Banks Module**

- **Purpose**: Banking partner integration and management
- **Key Components**:
  - Bank account validation
  - Transfer processing
  - Fee calculations
- **Database Functions**:
  - `prc_mng.fn_validate_bank_account()`
  - `prc_mng.fn_process_bank_transfer()`

---

## **📊 Verification & Compliance**

### **Veriflevels Module**

- **Purpose**: KYC/AML compliance and verification levels
- **Key Components**:
  - Document upload handling
  - SILT integration
  - Verification status management
- **Database Functions**:
  - `sec_cust.fn_update_verification_level()`
  - `sec_cust.fn_validate_documents()`

### **Silt Module**

- **Purpose**: Identity verification service integration
- **Key Components**:
  - Webhook processing
  - Queue job creation
  - Status synchronization
- **Database Functions**:
  - `sec_cust.fn_update_silt_status()`
  - `sec_cust.fn_process_silt_callback()`

---

## **🏦 Payment Processing**

### **Transbank Module**

- **Purpose**: Chilean payment gateway integration
- **Key Components**:
  - WebPay Plus integration
  - Transaction status handling
  - Webhook processing
- **Database Functions**:
  - `ord_sch.fn_create_transbank_transaction()`
  - `ord_sch.fn_update_payment_status()`

### **Tumipay Module**

- **Purpose**: Alternative payment method integration
- **Key Components**:
  - Payment processing
  - Status callbacks
  - Fee management
- **Database Functions**:
  - `ord_sch.fn_process_tumipay_payment()`

### **Mercadopago Module**

- **Purpose**: MercadoPago payment integration
- **Key Components**:
  - Payment link generation
  - Webhook handling
  - Transaction tracking
- **Database Functions**:
  - `ord_sch.fn_create_mercadopago_payment()`

---

## **📱 Communication & Messaging**

### **Whatsapp Module**

- **Purpose**: WhatsApp messaging integration
- **Key Components**:
  - Message sending
  - Template management
  - Delivery tracking
- **Database Functions**:
  - `msg_app.fn_send_whatsapp_message()`
  - `msg_app.fn_log_message_delivery()`

### **Messages Module**

- **Purpose**: Internal messaging system
- **Key Components**:
  - Message creation
  - Notification delivery
  - Message history
- **Database Functions**:
  - `msg_app.fn_create_message()`
  - `msg_app.fn_get_user_messages()`

### **Notifications Module**

- **Purpose**: System notification management
- **Key Components**:
  - Push notifications
  - Email notifications
  - SMS notifications
- **Database Functions**:
  - `msg_app.fn_create_notification()`
  - `msg_app.fn_mark_notification_read()`

---

## **🌍 Geographic & Regulatory**

### **Countries Module**

- **Purpose**: Country and region management
- **Key Components**:
  - Country configuration
  - Regional settings
  - Currency mappings
- **Database Functions**:
  - `public.fn_get_countries()`
  - `public.fn_get_country_config()`

### **Currencies Module**

- **Purpose**: Currency management and operations
- **Key Components**:
  - Currency definitions
  - Exchange rate tracking
  - Format configurations
- **Database Functions**:
  - `public.fn_get_currencies()`
  - `public.fn_format_currency()`

### **Codevalues Module**

- **Purpose**: System code values and configurations
- **Key Components**:
  - Dropdown values
  - System configurations
  - Reference data
- **Database Functions**:
  - `public.fn_get_code_values()`
  - `public.fn_get_system_config()`

---

## **👥 Employee & Administration**

### **Employees Module**

- **Purpose**: Employee management and operations
- **Key Components**:
  - Employee authentication
  - Role management
  - Activity logging
- **Database Functions**:
  - `sec_emp.fn_authenticate_employee()`
  - `sec_emp.fn_get_employee_permissions()`

### **Admin Module**

- **Purpose**: Administrative operations and tools
- **Key Components**:
  - System administration
  - User management
  - Report generation
- **Database Functions**:
  - `sec_emp.fn_admin_operations()`
  - `sec_emp.fn_generate_reports()`

---

## **📈 Analytics & Tracking**

### **Analytics Module**

- **Purpose**: Business analytics and metrics
- **Key Components**:
  - Transaction analytics
  - User behavior tracking
  - Performance metrics
- **Database Functions**:
  - `prc_mng.fn_get_transaction_analytics()`
  - `prc_mng.fn_generate_metrics()`

### **Tracking Module**

- **Purpose**: Transaction and process tracking
- **Key Components**:
  - Status tracking
  - Event logging
  - Audit trails
- **Database Functions**:
  - `ord_sch.fn_track_transaction()`
  - `ord_sch.fn_create_audit_log()`

---

## **⚙️ Utilities & Infrastructure**

### **Uploads Module**

- **Purpose**: File upload and management
- **Key Components**:
  - Document uploads
  - File validation
  - Storage management
- **Database Functions**:
  - `public.fn_save_file_metadata()`
  - `public.fn_validate_file_type()`

### **Logs Module**

- **Purpose**: System logging and monitoring
- **Key Components**:
  - Error logging
  - Activity tracking
  - Performance monitoring
- **Database Functions**:
  - `public.fn_create_log_entry()`
  - `public.fn_get_system_logs()`

### **Sessions Module**

- **Purpose**: Session management and storage
- **Key Components**:
  - Session creation
  - Session validation
  - Session cleanup
- **Database Functions**:
  - `sec_cust.fn_create_session()`
  - `sec_cust.fn_cleanup_expired_sessions()`

---

## **🔌 External Integrations**

### **External APIs Module**

- **Purpose**: Third-party API integrations
- **Key Components**:
  - Rate providers
  - Payment gateways
  - Verification services
- **Database Functions**:
  - `public.fn_log_api_call()`
  - `public.fn_get_api_config()`

### **Webhooks Module**

- **Purpose**: Webhook handling and processing
- **Key Components**:
  - Webhook validation
  - Event processing
  - Response handling
- **Database Functions**:
  - `public.fn_process_webhook()`
  - `public.fn_validate_webhook_signature()`

---

## **🎯 Business Intelligence**

### **Reports Module**

- **Purpose**: Report generation and data export
- **Key Components**:
  - Financial reports
  - Compliance reports
  - Custom analytics
- **Database Functions**:
  - `prc_mng.fn_generate_financial_report()`
  - `prc_mng.fn_export_compliance_data()`

### **Dashboard Module**

- **Purpose**: Real-time dashboard data
- **Key Components**:
  - Key metrics
  - Real-time updates
  - Visual data
- **Database Functions**:
  - `prc_mng.fn_get_dashboard_metrics()`
  - `prc_mng.fn_get_real_time_data()`

---

## **🛡️ Security & Monitoring**

### **Security Module**

- **Purpose**: Advanced security features
- **Key Components**:
  - Fraud detection
  - Security monitoring
  - Risk assessment
- **Database Functions**:
  - `sec_cust.fn_detect_fraud()`
  - `sec_cust.fn_assess_risk()`

### **Monitoring Module**

- **Purpose**: System monitoring and health checks
- **Key Components**:
  - Health endpoints
  - Performance monitoring
  - Alert management
- **Database Functions**:
  - `public.fn_health_check()`
  - `public.fn_monitor_performance()`

---

## **📱 API Endpoints Pattern**

Each module typically follows this endpoint structure:

```javascript
// Standard CRUD Operations
GET    /api/{module}           // List all
GET    /api/{module}/:id       // Get by ID
POST   /api/{module}           // Create new
PUT    /api/{module}/:id       // Update existing
DELETE /api/{module}/:id       // Delete existing

// Business-specific Operations
POST   /api/{module}/action    // Specific business action
GET    /api/{module}/search    // Search functionality
POST   /api/{module}/validate  // Validation endpoint
```

---

## **🔄 Module Dependencies**

### **Core Dependencies**

- **Authentication** → Used by all modules for security
- **Users** → Referenced by most modules for user context
- **Logs** → Used by all modules for tracking

### **Business Dependencies**

- **Remittances** → Depends on Rates, Banks, Users, Veriflevels
- **Rates** → Depends on Countries, Currencies
- **Banks** → Depends on Countries, Currencies
- **Veriflevels** → Depends on Uploads, Silt

### **Integration Dependencies**

- **Silt** → Depends on Veriflevels, Users
- **Transbank** → Depends on Remittances, Orders
- **Whatsapp** → Depends on Messages, Notifications

This modular architecture ensures clean separation of concerns, maintainable code, and scalable business logic organization.
