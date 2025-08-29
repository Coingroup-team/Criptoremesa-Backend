# SIXMAP Database Schema Documentation

**Generated on:** 2025-08-06T15:11:52.632Z
**Total Tables:** 253
**Schemas:** msg_app, ord_sch, prc_mng, priv, public, sec_cust, sec_emp

**Estimated Total Rows:** 8.474.869

## Table of Contents

- [msg_app.lnk_atc_whatsapp_msgs](#msgapplnkatcwhatsappmsgs)
- [msg_app.lnk_default_msgs](#msgapplnkdefaultmsgs)
- [msg_app.ms_chat_events](#msgappmschatevents)
- [msg_app.ms_chats_whatsapp](#msgappmschatswhatsapp)
- [msg_app.ms_chats_whatsapp_link_requests](#msgappmschatswhatsapplinkrequests)
- [msg_app.ms_default_msg_types](#msgappmsdefaultmsgtypes)
- [msg_app.ms_default_range_time](#msgappmsdefaultrangetime)
- [msg_app.ms_phone_contacts](#msgappmsphonecontacts)
- [msg_app.ms_whatsapp_atc_phones](#msgappmswhatsappatcphones)
- [msg_app.ms_whatsapp_msg_json](#msgappmswhatsappmsgjson)
- [msg_app.session_obj](#msgappsessionobj)
- [msg_app.v_chats_event_log](#msgappvchatseventlog)
- [msg_app.v_chats_info](#msgappvchatsinfo)
- [msg_app.v_msg](#msgappvmsg)
- [msg_app.v_phones_with_country](#msgappvphoneswithcountry)
- [ord_sch.lnk_currencies_pairs_offers](#ordschlnkcurrenciespairsoffers)
- [ord_sch.ms_consults](#ordschmsconsults)
- [ord_sch.ms_cost_rates](#ordschmscostrates)
- [ord_sch.ms_currencies_pairs](#ordschmscurrenciespairs)
- [ord_sch.ms_currency_risks](#ordschmscurrencyrisks)
- [ord_sch.ms_exchange_maker_taker_fees](#ordschmsexchangemakertakerfees)
- [ord_sch.ms_exchange_orders](#ordschmsexchangeorders)
- [ord_sch.ms_exchanges](#ordschmsexchanges)
- [ord_sch.ms_extract_data](#ordschmsextractdata)
- [ord_sch.ms_market_fees](#ordschmsmarketfees)
- [ord_sch.ms_market_rates](#ordschmsmarketrates)
- [ord_sch.ms_market_types](#ordschmsmarkettypes)
- [ord_sch.ms_order_types](#ordschmsordertypes)
- [ord_sch.ms_pay_methods](#ordschmspaymethods)
- [ord_sch.ms_public_fees](#ordschmspublicfees)
- [ord_sch.v_active_consults](#ordschvactiveconsults)
- [ord_sch.v_active_offers](#ordschvactiveoffers)
- [ord_sch.v_active_orders](#ordschvactiveorders)
- [ord_sch.v_currencies_pairs](#ordschvcurrenciespairs)
- [ord_sch.v_exchanges](#ordschvexchanges)
- [ord_sch.v_exchanges_fee_comparative](#ordschvexchangesfeecomparative)
- [prc_mng.exchanges_responses](#prcmngexchangesresponses)
- [prc_mng.lnk_amount_limits](#prcmnglnkamountlimits)
- [prc_mng.lnk_bank_account_initial_balances](#prcmnglnkbankaccountinitialbalances)
- [prc_mng.lnk_buy_cycle_currencies](#prcmnglnkbuycyclecurrencies)
- [prc_mng.lnk_buy_cycle_operations](#prcmnglnkbuycycleoperations)
- [prc_mng.lnk_cr_exchanges](#prcmnglnkcrexchanges)
- [prc_mng.lnk_cr_remittances](#prcmnglnkcrremittances)
- [prc_mng.lnk_exchange_account_initial_balances](#prcmnglnkexchangeaccountinitialbalances)
- [prc_mng.lnk_exchange_accounts_fiat_currencies](#prcmnglnkexchangeaccountsfiatcurrencies)
- [prc_mng.lnk_exchange_range_rates](#prcmnglnkexchangerangerates)
- [prc_mng.lnk_fund_exchange_accounts](#prcmnglnkfundexchangeaccounts)
- [prc_mng.lnk_internal_operations](#prcmnglnkinternaloperations)
- [prc_mng.lnk_netted_operations](#prcmnglnknettedoperations)
- [prc_mng.lnk_pending_transactions](#prcmnglnkpendingtransactions)
- [prc_mng.lnk_req_actions_grp_emp](#prcmnglnkreqactionsgrpemp)
- [prc_mng.lnk_residual_operations](#prcmnglnkresidualoperations)
- [prc_mng.lnk_sell_cycle_currencies](#prcmnglnksellcyclecurrencies)
- [prc_mng.lnk_sell_cycle_operations](#prcmnglnksellcycleoperations)
- [prc_mng.lnk_third_party_accounts](#prcmnglnkthirdpartyaccounts)
- [prc_mng.lnk_transfer_result](#prcmnglnktransferresult)
- [prc_mng.lnk_user_consult](#prcmnglnkuserconsult)
- [prc_mng.ms_actions](#prcmngmsactions)
- [prc_mng.ms_buy_cycles](#prcmngmsbuycycles)
- [prc_mng.ms_cr_beneficiaries](#prcmngmscrbeneficiaries)
- [prc_mng.ms_cr_claims](#prcmngmscrclaims)
- [prc_mng.ms_cr_frequents_beneficiaries](#prcmngmscrfrequentsbeneficiaries)
- [prc_mng.ms_cr_origin_transactions](#prcmngmscrorigintransactions)
- [prc_mng.ms_crypto_fees](#prcmngmscryptofees)
- [prc_mng.ms_cycle_balances](#prcmngmscyclebalances)
- [prc_mng.ms_destiny_fee_commission_percentages](#prcmngmsdestinyfeecommissionpercentages)
- [prc_mng.ms_exchange_accounts](#prcmngmsexchangeaccounts)
- [prc_mng.ms_exchange_address](#prcmngmsexchangeaddress)
- [prc_mng.ms_exchange_atc_revision_status](#prcmngmsexchangeatcrevisionstatus)
- [prc_mng.ms_exchange_award_status](#prcmngmsexchangeawardstatus)
- [prc_mng.ms_exchange_bank_verif_status](#prcmngmsexchangebankverifstatus)
- [prc_mng.ms_exchange_buy_cycle_status](#prcmngmsexchangebuycyclestatus)
- [prc_mng.ms_exchange_claim_status](#prcmngmsexchangeclaimstatus)
- [prc_mng.ms_exchange_modified_status](#prcmngmsexchangemodifiedstatus)
- [prc_mng.ms_exchange_notif_client_status](#prcmngmsexchangenotifclientstatus)
- [prc_mng.ms_exchange_ok_award_status](#prcmngmsexchangeokawardstatus)
- [prc_mng.ms_exchange_ok_transf_status](#prcmngmsexchangeoktransfstatus)
- [prc_mng.ms_exchange_pause_status](#prcmngmsexchangepausestatus)
- [prc_mng.ms_exchange_principal_status](#prcmngmsexchangeprincipalstatus)
- [prc_mng.ms_exchange_public_status](#prcmngmsexchangepublicstatus)
- [prc_mng.ms_exchange_rates](#prcmngmsexchangerates)
- [prc_mng.ms_exchange_sell_cycle_status](#prcmngmsexchangesellcyclestatus)
- [prc_mng.ms_exchange_transf_status](#prcmngmsexchangetransfstatus)
- [prc_mng.ms_exchange_types](#prcmngmsexchangetypes)
- [prc_mng.ms_log_action_com](#prcmngmslogactioncom)
- [prc_mng.ms_networks](#prcmngmsnetworks)
- [prc_mng.ms_operation_routes](#prcmngmsoperationroutes)
- [prc_mng.ms_origin_fee_commission_percentages](#prcmngmsoriginfeecommissionpercentages)
- [prc_mng.ms_origin_transaction_types](#prcmngmsorigintransactiontypes)
- [prc_mng.ms_payment_service](#prcmngmspaymentservice)
- [prc_mng.ms_pre_exchange](#prcmngmspreexchange)
- [prc_mng.ms_remittance_bank_verif_status](#prcmngmsremittancebankverifstatus)
- [prc_mng.ms_remittance_buy_cycle_status](#prcmngmsremittancebuycyclestatus)
- [prc_mng.ms_remittance_claim_status](#prcmngmsremittanceclaimstatus)
- [prc_mng.ms_remittance_comments](#prcmngmsremittancecomments)
- [prc_mng.ms_remittance_log_actions](#prcmngmsremittancelogactions)
- [prc_mng.ms_remittance_notif_benef_status](#prcmngmsremittancenotifbenefstatus)
- [prc_mng.ms_remittance_pause_status](#prcmngmsremittancepausestatus)
- [prc_mng.ms_remittance_principal_status](#prcmngmsremittanceprincipalstatus)
- [prc_mng.ms_remittance_public_status](#prcmngmsremittancepublicstatus)
- [prc_mng.ms_remittance_revision_status](#prcmngmsremittancerevisionstatus)
- [prc_mng.ms_remittance_sell_cycle_status](#prcmngmsremittancesellcyclestatus)
- [prc_mng.ms_req_workflow_asig_actions](#prcmngmsreqworkflowasigactions)
- [prc_mng.ms_result_type](#prcmngmsresulttype)
- [prc_mng.ms_sell_cycles](#prcmngmssellcycles)
- [prc_mng.ms_third_party_users](#prcmngmsthirdpartyusers)
- [prc_mng.ms_transfer_fees](#prcmngmstransferfees)
- [prc_mng.ms_user_consult_types](#prcmngmsuserconsulttypes)
- [prc_mng.ms_user_process_asings](#prcmngmsuserprocessasings)
- [prc_mng.v_bank_accounts_actual_balances](#prcmngvbankaccountsactualbalances)
- [prc_mng.v_bank_accounts_movements](#prcmngvbankaccountsmovements)
- [prc_mng.v_bh_app_remittance_info](#prcmngvbhappremittanceinfo)
- [prc_mng.v_buy_cycle_currencies_detail](#prcmngvbuycyclecurrenciesdetail)
- [prc_mng.v_buy_cycle_operations_detail](#prcmngvbuycycleoperationsdetail)
- [prc_mng.v_exchange_account_movements](#prcmngvexchangeaccountmovements)
- [prc_mng.v_exchanges_full_info](#prcmngvexchangesfullinfo)
- [prc_mng.v_full_exchange_rates](#prcmngvfullexchangerates)
- [prc_mng.v_lnk_cr_remittances_info](#prcmngvlnkcrremittancesinfo)
- [prc_mng.v_ms_buy_cycle_detail](#prcmngvmsbuycycledetail)
- [prc_mng.v_ms_emp_sixmap_to_asing](#prcmngvmsempsixmaptoasing)
- [prc_mng.v_ms_log_action_com_info](#prcmngvmslogactioncominfo)
- [prc_mng.v_ms_sell_cycle_detail](#prcmngvmssellcycledetail)
- [prc_mng.v_ms_sixmap_users_current_asings_by_user](#prcmngvmssixmapuserscurrentasingsbyuser)
- [prc_mng.v_queue_balances](#prcmngvqueuebalances)
- [prc_mng.v_remittances_status_info](#prcmngvremittancesstatusinfo)
- [prc_mng.v_sell_cycle_currencies_detail](#prcmngvsellcyclecurrenciesdetail)
- [prc_mng.v_sell_cycle_operations_detail](#prcmngvsellcycleoperationsdetail)
- [prc_mng.v_transfers_to_do](#prcmngvtransferstodo)
- [prc_mng.v_transfers_to_do_massive_data](#prcmngvtransferstodomassivedata)
- [priv.ms_sixmap_users](#privmssixmapusers)
- [public.full_user](#publicfulluser)
- [sec_cust.env_variables](#seccustenvvariables)
- [sec_cust.lnk_bank_currencies](#seccustlnkbankcurrencies)
- [sec_cust.lnk_bank_pay_method](#seccustlnkbankpaymethod)
- [sec_cust.lnk_country_currency](#seccustlnkcountrycurrency)
- [sec_cust.lnk_limit_vl](#seccustlnklimitvl)
- [sec_cust.lnk_limit_vl_country](#seccustlnklimitvlcountry)
- [sec_cust.lnk_mail_user](#seccustlnkmailuser)
- [sec_cust.lnk_opspwds_registred_by_user](#seccustlnkopspwdsregistredbyuser)
- [sec_cust.lnk_profiles_roles](#seccustlnkprofilesroles)
- [sec_cust.lnk_pwds_registred_by_user](#seccustlnkpwdsregistredbyuser)
- [sec_cust.lnk_range_rates](#seccustlnkrangerates)
- [sec_cust.lnk_roles_routes](#seccustlnkrolesroutes)
- [sec_cust.lnk_users_departments](#seccustlnkusersdepartments)
- [sec_cust.lnk_users_extra_data](#seccustlnkusersextradata)
- [sec_cust.lnk_users_loyalty_levels](#seccustlnkusersloyaltylevels)
- [sec_cust.lnk_users_risk_levels](#seccustlnkusersrisklevels)
- [sec_cust.lnk_users_verif_level](#seccustlnkusersveriflevel)
- [sec_cust.logs_actions_obj](#seccustlogsactionsobj)
- [sec_cust.loyalty_levels](#seccustloyaltylevels)
- [sec_cust.mail_logs](#seccustmaillogs)
- [sec_cust.ms_address](#seccustmsaddress)
- [sec_cust.ms_allied_banks](#seccustmsalliedbanks)
- [sec_cust.ms_balances](#seccustmsbalances)
- [sec_cust.ms_bank_accounts](#seccustmsbankaccounts)
- [sec_cust.ms_bank_fees](#seccustmsbankfees)
- [sec_cust.ms_banks](#seccustmsbanks)
- [sec_cust.ms_category](#seccustmscategory)
- [sec_cust.ms_cod_users_ranks](#seccustmscodusersranks)
- [sec_cust.ms_cr_manual_rate](#seccustmscrmanualrate)
- [sec_cust.ms_cr_rate](#seccustmscrrate)
- [sec_cust.ms_cr_rate_type](#seccustmscrratetype)
- [sec_cust.ms_cr_special_rate](#seccustmscrspecialrate)
- [sec_cust.ms_cr_vip_rate](#seccustmscrviprate)
- [sec_cust.ms_currencies](#seccustmscurrencies)
- [sec_cust.ms_departments](#seccustmsdepartments)
- [sec_cust.ms_doc_type](#seccustmsdoctype)
- [sec_cust.ms_fiat_rates](#seccustmsfiatrates)
- [sec_cust.ms_fields](#seccustmsfields)
- [sec_cust.ms_global_notifications](#seccustmsglobalnotifications)
- [sec_cust.ms_item](#seccustmsitem)
- [sec_cust.ms_level_answers](#seccustmslevelanswers)
- [sec_cust.ms_level_questions](#seccustmslevelquestions)
- [sec_cust.ms_limit_routes](#seccustmslimitroutes)
- [sec_cust.ms_limit_routes_by_ip](#seccustmslimitroutesbyip)
- [sec_cust.ms_limitations](#seccustmslimitations)
- [sec_cust.ms_mail](#seccustmsmail)
- [sec_cust.ms_migration_status](#seccustmsmigrationstatus)
- [sec_cust.ms_notifications](#seccustmsnotifications)
- [sec_cust.ms_operation](#seccustmsoperation)
- [sec_cust.ms_over_quota](#seccustmsoverquota)
- [sec_cust.ms_pay_methods](#seccustmspaymethods)
- [sec_cust.ms_phone](#seccustmsphone)
- [sec_cust.ms_pre_remittance](#seccustmspreremittance)
- [sec_cust.ms_profiles](#seccustmsprofiles)
- [sec_cust.ms_roles](#seccustmsroles)
- [sec_cust.ms_routes](#seccustmsroutes)
- [sec_cust.ms_sixmap_services](#seccustmssixmapservices)
- [sec_cust.ms_sixmap_services_users_public_codes](#seccustmssixmapservicesuserspubliccodes)
- [sec_cust.ms_sixmap_services_utype](#seccustmssixmapservicesutype)
- [sec_cust.ms_sixmap_users](#seccustmssixmapusers)
- [sec_cust.ms_suspicious_activities](#seccustmssuspiciousactivities)
- [sec_cust.ms_temp_codes](#seccustmstempcodes)
- [sec_cust.ms_thirdparty_transfers](#seccustmsthirdpartytransfers)
- [sec_cust.ms_user_accounts](#seccustmsuseraccounts)
- [sec_cust.ms_user_notification_types](#seccustmsusernotificationtypes)
- [sec_cust.ms_users_archives_status](#seccustmsusersarchivesstatus)
- [sec_cust.ms_verif_level](#seccustmsveriflevel)
- [sec_cust.ms_verifications](#seccustmsverifications)
- [sec_cust.ms_wallets](#seccustmswallets)
- [sec_cust.ms_wholesale_partners](#seccustmswholesalepartners)
- [sec_cust.ms_wholesale_partners_config](#seccustmswholesalepartnersconfig)
- [sec_cust.ms_wholesale_partners_info](#seccustmswholesalepartnersinfo)
- [sec_cust.ms_wholesale_partners_questions](#seccustmswholesalepartnersquestions)
- [sec_cust.pg_stat_statements](#seccustpgstatstatements)
- [sec_cust.risk_levels](#seccustrisklevels)
- [sec_cust.session_obj](#seccustsessionobj)
- [sec_cust.tmp_ext_oper_v_customers](#seccusttmpextopervcustomers)
- [sec_cust.v_bh_users_info](#seccustvbhusersinfo)
- [sec_cust.v_users_to_zoho_campaign](#seccustvuserstozohocampaign)
- [sec_cust.v_users_to_zoho_campaign_eu](#seccustvuserstozohocampaigneu)
- [sec_cust.v_verification_level](#seccustvverificationlevel)
- [sec_emp.asn_blocks](#secempasnblocks)
- [sec_emp.geoip_blocks](#secempgeoipblocks)
- [sec_emp.geoip_locations](#secempgeoiplocations)
- [sec_emp.lnk_opspwds_registred_by_user](#secemplnkopspwdsregistredbyuser)
- [sec_emp.lnk_profiles_roles](#secemplnkprofilesroles)
- [sec_emp.lnk_pwds_registred_by_user](#secemplnkpwdsregistredbyuser)
- [sec_emp.lnk_roles_routes](#secemplnkrolesroutes)
- [sec_emp.lnk_users_departments](#secemplnkusersdepartments)
- [sec_emp.logs_actions_obj](#secemplogsactionsobj)
- [sec_emp.ms_all_countries](#secempmsallcountries)
- [sec_emp.ms_atc_hours](#secempmsatchours)
- [sec_emp.ms_companies_competition](#secempmscompaniescompetition)
- [sec_emp.ms_competition_rates](#secempmscompetitionrates)
- [sec_emp.ms_competitions_captures](#secempmscompetitionscaptures)
- [sec_emp.ms_countries](#secempmscountries)
- [sec_emp.ms_departments](#secempmsdepartments)
- [sec_emp.ms_doc_type](#secempmsdoctype)
- [sec_emp.ms_forgot_password_attempt](#secempmsforgotpasswordattempt)
- [sec_emp.ms_ip_countries](#secempmsipcountries)
- [sec_emp.ms_migration_error_reports](#secempmsmigrationerrorreports)
- [sec_emp.ms_over_quota](#secempmsoverquota)
- [sec_emp.ms_phone](#secempmsphone)
- [sec_emp.ms_profiles](#secempmsprofiles)
- [sec_emp.ms_properties](#secempmsproperties)
- [sec_emp.ms_roles](#secempmsroles)
- [sec_emp.ms_routes](#secempmsroutes)
- [sec_emp.ms_sixmap_services](#secempmssixmapservices)
- [sec_emp.ms_sixmap_services_utype](#secempmssixmapservicesutype)
- [sec_emp.ms_sixmap_users](#secempmssixmapusers)
- [sec_emp.ms_state_countries](#secempmsstatecountries)
- [sec_emp.ms_temp_codes](#secempmstempcodes)
- [sec_emp.ms_users_migrated](#secempmsusersmigrated)
- [sec_emp.session_obj](#secempsessionobj)
- [sec_emp.v_account_type](#secempvaccounttype)
- [sec_emp.v_banks_accounts](#secempvbanksaccounts)
- [sec_emp.v_competition_company](#secempvcompetitioncompany)
- [sec_emp.v_competition_rates](#secempvcompetitionrates)
- [sec_emp.v_historical_competition_rates](#secempvhistoricalcompetitionrates)
- [sec_emp.v_pay_method](#secempvpaymethod)
- [sec_emp.v_ranking_competition_rates](#secempvrankingcompetitionrates)
- [sec_emp.v_verification_level](#secempvverificationlevel)

## Quick Statistics

| Table | Row Count | Columns | Has PK | Foreign Keys |
|-------|-----------|---------|--------|-------------|
| msg_app.lnk_atc_whatsapp_msgs | 13 | 12 | ✅ | 1 |
| msg_app.lnk_default_msgs | 54 | 6 | ✅ | 1 |
| msg_app.ms_chat_events | 13 | 7 | ✅ | 2 |
| msg_app.ms_chats_whatsapp | 2 | 9 | ✅ | 1 |
| msg_app.ms_chats_whatsapp_link_requests | 0 | 9 | ✅ | 1 |
| msg_app.ms_default_msg_types | 9 | 2 | ✅ | 0 |
| msg_app.ms_default_range_time | 3 | 5 | ✅ | 0 |
| msg_app.ms_phone_contacts | 7.041 | 8 | ✅ | 0 |
| msg_app.ms_whatsapp_atc_phones | 15 | 6 | ✅ | 0 |
| msg_app.ms_whatsapp_msg_json | 11 | 3 | ✅ | 1 |
| msg_app.session_obj | 4 | 52 | ✅ | 0 |
| msg_app.v_chats_event_log | 13 | 9 | ❌ | 0 |
| msg_app.v_chats_info | 0 | 35 | ❌ | 0 |
| msg_app.v_msg | 13 | 16 | ❌ | 0 |
| msg_app.v_phones_with_country | 14 | 6 | ❌ | 0 |
| ord_sch.lnk_currencies_pairs_offers | 5.678 | 22 | ✅ | 3 |
| ord_sch.ms_consults | 258 | 4 | ✅ | 0 |
| ord_sch.ms_cost_rates | 1.821 | 7 | ✅ | 0 |
| ord_sch.ms_currencies_pairs | 20 | 11 | ✅ | 0 |
| ord_sch.ms_currency_risks | 18 | 7 | ✅ | 0 |
| ord_sch.ms_exchange_maker_taker_fees | 24 | 5 | ✅ | 1 |
| ord_sch.ms_exchange_orders | 2.450 | 7 | ✅ | 3 |
| ord_sch.ms_exchanges | 9 | 3 | ✅ | 0 |
| ord_sch.ms_extract_data | 258 | 5 | ✅ | 3 |
| ord_sch.ms_market_fees | 24 | 9 | ✅ | 3 |
| ord_sch.ms_market_rates | 528 | 14 | ✅ | 2 |
| ord_sch.ms_market_types | 2 | 5 | ✅ | 0 |
| ord_sch.ms_order_types | 2 | 5 | ✅ | 0 |
| ord_sch.ms_pay_methods | 16.270 | 3 | ✅ | 1 |
| ord_sch.ms_public_fees | 336 | 7 | ✅ | 0 |
| ord_sch.v_active_consults | 56 | 5 | ❌ | 0 |
| ord_sch.v_active_offers | 1.744 | 14 | ❌ | 0 |
| ord_sch.v_active_orders | 350 | 7 | ❌ | 0 |
| ord_sch.v_currencies_pairs | 20 | 11 | ❌ | 0 |
| ord_sch.v_exchanges | 9 | 2 | ❌ | 0 |
| ord_sch.v_exchanges_fee_comparative | 27 | 9 | ❌ | 0 |
| prc_mng.exchanges_responses | 0 | 5 | ✅ | 1 |
| prc_mng.lnk_amount_limits | 380 | 9 | ✅ | 2 |
| prc_mng.lnk_bank_account_initial_balances | 41 | 4 | ✅ | 1 |
| prc_mng.lnk_buy_cycle_currencies | 9 | 3 | ✅ | 1 |
| prc_mng.lnk_buy_cycle_operations | 3 | 30 | ✅ | 2 |
| prc_mng.lnk_cr_exchanges | 0 | 48 | ✅ | 20 |
| prc_mng.lnk_cr_remittances | 202 | 49 | ✅ | 11 |
| prc_mng.lnk_exchange_account_initial_balances | 0 | 4 | ✅ | 2 |
| prc_mng.lnk_exchange_accounts_fiat_currencies | 33 | 4 | ✅ | 1 |
| prc_mng.lnk_exchange_range_rates | 57 | 8 | ✅ | 1 |
| prc_mng.lnk_fund_exchange_accounts | 0 | 9 | ✅ | 2 |
| prc_mng.lnk_internal_operations | 0 | 9 | ✅ | 1 |
| prc_mng.lnk_netted_operations | 0 | 10 | ✅ | 2 |
| prc_mng.lnk_pending_transactions | 0 | 21 | ✅ | 1 |
| prc_mng.lnk_req_actions_grp_emp | 44 | 16 | ✅ | 1 |
| prc_mng.lnk_residual_operations | 0 | 11 | ✅ | 4 |
| prc_mng.lnk_sell_cycle_currencies | 10 | 3 | ✅ | 1 |
| prc_mng.lnk_sell_cycle_operations | 4 | 30 | ✅ | 2 |
| prc_mng.lnk_third_party_accounts | 1 | 4 | ✅ | 1 |
| prc_mng.lnk_transfer_result | 42 | 9 | ✅ | 3 |
| prc_mng.lnk_user_consult | 1 | 9 | ✅ | 1 |
| prc_mng.ms_actions | 6 | 5 | ✅ | 0 |
| prc_mng.ms_buy_cycles | 1 | 5 | ✅ | 1 |
| prc_mng.ms_cr_beneficiaries | 265 | 35 | ✅ | 8 |
| prc_mng.ms_cr_claims | 0 | 5 | ✅ | 1 |
| prc_mng.ms_cr_frequents_beneficiaries | 32 | 20 | ✅ | 0 |
| prc_mng.ms_cr_origin_transactions | 134 | 31 | ✅ | 4 |
| prc_mng.ms_crypto_fees | 4 | 6 | ✅ | 1 |
| prc_mng.ms_cycle_balances | 1 | 3 | ✅ | 0 |
| prc_mng.ms_destiny_fee_commission_percentages | 8 | 3 | ✅ | 0 |
| prc_mng.ms_exchange_accounts | 8 | 5 | ✅ | 0 |
| prc_mng.ms_exchange_address | 19 | 8 | ❌ | 0 |
| prc_mng.ms_exchange_atc_revision_status | 3 | 2 | ✅ | 0 |
| prc_mng.ms_exchange_award_status | 7 | 2 | ✅ | 0 |
| prc_mng.ms_exchange_bank_verif_status | 4 | 2 | ✅ | 0 |
| prc_mng.ms_exchange_buy_cycle_status | 3 | 2 | ✅ | 0 |
| prc_mng.ms_exchange_claim_status | 2 | 2 | ✅ | 0 |
| prc_mng.ms_exchange_modified_status | 2 | 2 | ✅ | 0 |
| prc_mng.ms_exchange_notif_client_status | 2 | 2 | ✅ | 0 |
| prc_mng.ms_exchange_ok_award_status | 2 | 2 | ✅ | 0 |
| prc_mng.ms_exchange_ok_transf_status | 3 | 2 | ✅ | 0 |
| prc_mng.ms_exchange_pause_status | 4 | 2 | ✅ | 0 |
| prc_mng.ms_exchange_principal_status | 9 | 2 | ✅ | 0 |
| prc_mng.ms_exchange_public_status | 4 | 2 | ✅ | 0 |
| prc_mng.ms_exchange_rates | 57 | 8 | ❌ | 1 |
| prc_mng.ms_exchange_sell_cycle_status | 3 | 2 | ✅ | 0 |
| prc_mng.ms_exchange_transf_status | 3 | 2 | ✅ | 0 |
| prc_mng.ms_exchange_types | 5 | 5 | ❌ | 0 |
| prc_mng.ms_log_action_com | 134 | 11 | ✅ | 3 |
| prc_mng.ms_networks | 2 | 7 | ❌ | 0 |
| prc_mng.ms_operation_routes | 85 | 13 | ❌ | 2 |
| prc_mng.ms_origin_fee_commission_percentages | 8 | 5 | ✅ | 0 |
| prc_mng.ms_origin_transaction_types | 3 | 2 | ✅ | 0 |
| prc_mng.ms_payment_service | 1 | 2 | ✅ | 0 |
| prc_mng.ms_pre_exchange | 0 | 8 | ✅ | 0 |
| prc_mng.ms_remittance_bank_verif_status | 3 | 2 | ✅ | 0 |
| prc_mng.ms_remittance_buy_cycle_status | 2 | 2 | ✅ | 0 |
| prc_mng.ms_remittance_claim_status | 2 | 2 | ✅ | 0 |
| prc_mng.ms_remittance_comments | 0 | 4 | ✅ | 1 |
| prc_mng.ms_remittance_log_actions | 36 | 2 | ✅ | 0 |
| prc_mng.ms_remittance_notif_benef_status | 3 | 2 | ✅ | 0 |
| prc_mng.ms_remittance_pause_status | 4 | 2 | ✅ | 0 |
| prc_mng.ms_remittance_principal_status | 6 | 2 | ✅ | 0 |
| prc_mng.ms_remittance_public_status | 4 | 2 | ✅ | 0 |
| prc_mng.ms_remittance_revision_status | 3 | 2 | ✅ | 0 |
| prc_mng.ms_remittance_sell_cycle_status | 2 | 2 | ✅ | 0 |
| prc_mng.ms_req_workflow_asig_actions | 9 | 8 | ✅ | 1 |
| prc_mng.ms_result_type | 2 | 2 | ✅ | 0 |
| prc_mng.ms_sell_cycles | 1 | 5 | ✅ | 1 |
| prc_mng.ms_third_party_users | 1 | 10 | ✅ | 0 |
| prc_mng.ms_transfer_fees | 63 | 6 | ✅ | 1 |
| prc_mng.ms_user_consult_types | 6 | 2 | ✅ | 0 |
| prc_mng.ms_user_process_asings | 546 | 13 | ✅ | 6 |
| prc_mng.v_bank_accounts_actual_balances | 44 | 5 | ❌ | 0 |
| prc_mng.v_bank_accounts_movements | 171 | 7 | ❌ | 0 |
| prc_mng.v_bh_app_remittance_info | 46 | 10 | ❌ | 0 |
| prc_mng.v_buy_cycle_currencies_detail | 9 | 12 | ❌ | 0 |
| prc_mng.v_buy_cycle_operations_detail | 3 | 21 | ❌ | 0 |
| prc_mng.v_exchange_account_movements | 0 | 10 | ❌ | 0 |
| prc_mng.v_exchanges_full_info | 0 | 74 | ❌ | 0 |
| prc_mng.v_full_exchange_rates | 57 | 9 | ❌ | 0 |
| prc_mng.v_lnk_cr_remittances_info | 0 | 35 | ❌ | 0 |
| prc_mng.v_ms_buy_cycle_detail | 1 | 8 | ❌ | 0 |
| prc_mng.v_ms_emp_sixmap_to_asing | 1 | 6 | ❌ | 0 |
| prc_mng.v_ms_log_action_com_info | 134 | 14 | ❌ | 0 |
| prc_mng.v_ms_sell_cycle_detail | 1 | 8 | ❌ | 0 |
| prc_mng.v_ms_sixmap_users_current_asings_by_user | 1 | 8 | ❌ | 0 |
| prc_mng.v_queue_balances | 28 | 3 | ❌ | 0 |
| prc_mng.v_remittances_status_info | 192 | 64 | ❌ | 0 |
| prc_mng.v_sell_cycle_currencies_detail | 10 | 12 | ❌ | 0 |
| prc_mng.v_sell_cycle_operations_detail | 4 | 21 | ❌ | 0 |
| prc_mng.v_transfers_to_do | 31 | 16 | ❌ | 0 |
| prc_mng.v_transfers_to_do_massive_data | 177 | 16 | ❌ | 0 |
| priv.ms_sixmap_users | 5.189 | 5 | ✅ | 0 |
| public.full_user | 0 | 1 | ❌ | 0 |
| sec_cust.env_variables | 2 | 2 | ❌ | 0 |
| sec_cust.lnk_bank_currencies | 24 | 3 | ✅ | 2 |
| sec_cust.lnk_bank_pay_method | 689 | 3 | ✅ | 2 |
| sec_cust.lnk_country_currency | 14 | 3 | ✅ | 1 |
| sec_cust.lnk_limit_vl | 180 | 13 | ✅ | 2 |
| sec_cust.lnk_limit_vl_country | 184 | 6 | ✅ | 1 |
| sec_cust.lnk_mail_user | 0 | 4 | ✅ | 2 |
| sec_cust.lnk_opspwds_registred_by_user | 0 | 6 | ✅ | 1 |
| sec_cust.lnk_profiles_roles | 0 | 6 | ✅ | 5 |
| sec_cust.lnk_pwds_registred_by_user | 5.075 | 6 | ✅ | 1 |
| sec_cust.lnk_range_rates | 717 | 10 | ✅ | 3 |
| sec_cust.lnk_roles_routes | 0 | 6 | ✅ | 5 |
| sec_cust.lnk_users_departments | 0 | 6 | ✅ | 2 |
| sec_cust.lnk_users_extra_data | 6 | 5 | ✅ | 2 |
| sec_cust.lnk_users_loyalty_levels | 0 | 4 | ✅ | 2 |
| sec_cust.lnk_users_risk_levels | 0 | 4 | ✅ | 2 |
| sec_cust.lnk_users_verif_level | 10.109 | 15 | ✅ | 3 |
| sec_cust.logs_actions_obj | 61.206 | 16 | ✅ | 0 |
| sec_cust.loyalty_levels | 4 | 2 | ✅ | 0 |
| sec_cust.mail_logs | 368 | 9 | ❌ | 0 |
| sec_cust.ms_address | 0 | 6 | ✅ | 1 |
| sec_cust.ms_allied_banks | 4 | 3 | ✅ | 2 |
| sec_cust.ms_balances | 0 | 17 | ✅ | 4 |
| sec_cust.ms_bank_accounts | 61 | 13 | ✅ | 3 |
| sec_cust.ms_bank_fees | 1.803 | 7 | ✅ | 2 |
| sec_cust.ms_banks | 553 | 6 | ✅ | 0 |
| sec_cust.ms_category | 1 | 3 | ✅ | 0 |
| sec_cust.ms_cod_users_ranks | 0 | 9 | ✅ | 3 |
| sec_cust.ms_cr_manual_rate | 5.614 | 17 | ✅ | 3 |
| sec_cust.ms_cr_rate | 27 | 11 | ✅ | 3 |
| sec_cust.ms_cr_rate_type | 8 | 2 | ✅ | 0 |
| sec_cust.ms_cr_special_rate | 0 | 19 | ✅ | 2 |
| sec_cust.ms_cr_vip_rate | 0 | 14 | ✅ | 3 |
| sec_cust.ms_currencies | 12 | 10 | ✅ | 0 |
| sec_cust.ms_departments | 11 | 5 | ✅ | 0 |
| sec_cust.ms_doc_type | 782 | 14 | ✅ | 1 |
| sec_cust.ms_fiat_rates | 0 | 4 | ✅ | 2 |
| sec_cust.ms_fields | 61 | 6 | ✅ | 2 |
| sec_cust.ms_global_notifications | 20 | 11 | ✅ | 1 |
| sec_cust.ms_item | 2 | 4 | ✅ | 1 |
| sec_cust.ms_level_answers | 80 | 9 | ✅ | 1 |
| sec_cust.ms_level_questions | 4 | 8 | ✅ | 0 |
| sec_cust.ms_limit_routes | 2 | 4 | ✅ | 0 |
| sec_cust.ms_limit_routes_by_ip | 119 | 5 | ✅ | 1 |
| sec_cust.ms_limitations | 6 | 6 | ✅ | 0 |
| sec_cust.ms_mail | 0 | 4 | ✅ | 0 |
| sec_cust.ms_migration_status | 4 | 5 | ✅ | 0 |
| sec_cust.ms_notifications | 5.138 | 9 | ✅ | 2 |
| sec_cust.ms_operation | 0 | 3 | ✅ | 1 |
| sec_cust.ms_over_quota | 0 | 5 | ✅ | 1 |
| sec_cust.ms_pay_methods | 27 | 8 | ✅ | 1 |
| sec_cust.ms_phone | 5.054 | 14 | ✅ | 1 |
| sec_cust.ms_pre_remittance | 214 | 8 | ✅ | 1 |
| sec_cust.ms_profiles | 6 | 5 | ✅ | 0 |
| sec_cust.ms_roles | 0 | 5 | ✅ | 0 |
| sec_cust.ms_routes | 0 | 8 | ✅ | 0 |
| sec_cust.ms_sixmap_services | 1 | 5 | ✅ | 0 |
| sec_cust.ms_sixmap_services_users_public_codes | 0 | 7 | ✅ | 2 |
| sec_cust.ms_sixmap_services_utype | 3 | 6 | ✅ | 1 |
| sec_cust.ms_sixmap_users | 5.061 | 58 | ✅ | 5 |
| sec_cust.ms_suspicious_activities | 0 | 3 | ✅ | 1 |
| sec_cust.ms_temp_codes | 118 | 8 | ✅ | 0 |
| sec_cust.ms_thirdparty_transfers | 0 | 8 | ✅ | 0 |
| sec_cust.ms_user_accounts | 0 | 15 | ✅ | 5 |
| sec_cust.ms_user_notification_types | 3 | 3 | ✅ | 0 |
| sec_cust.ms_users_archives_status | 0 | 4 | ❌ | 0 |
| sec_cust.ms_verif_level | 247 | 12 | ✅ | 3 |
| sec_cust.ms_verifications | 3 | 5 | ✅ | 0 |
| sec_cust.ms_wallets | 32 | 10 | ✅ | 1 |
| sec_cust.ms_wholesale_partners | 0 | 6 | ✅ | 1 |
| sec_cust.ms_wholesale_partners_config | 1 | 4 | ✅ | 0 |
| sec_cust.ms_wholesale_partners_info | 0 | 9 | ✅ | 1 |
| sec_cust.ms_wholesale_partners_questions | 0 | 8 | ✅ | 1 |
| sec_cust.pg_stat_statements | 4.987 | 32 | ❌ | 0 |
| sec_cust.risk_levels | 4 | 2 | ✅ | 0 |
| sec_cust.session_obj | 0 | 52 | ✅ | 2 |
| sec_cust.tmp_ext_oper_v_customers | 0 | 36 | ❌ | 0 |
| sec_cust.v_bh_users_info | 0 | 36 | ❌ | 0 |
| sec_cust.v_users_to_zoho_campaign | 5.055 | 9 | ❌ | 0 |
| sec_cust.v_users_to_zoho_campaign_eu | 6 | 9 | ❌ | 0 |
| sec_cust.v_verification_level | 10.109 | 15 | ❌ | 0 |
| sec_emp.asn_blocks | 536.807 | 3 | ❌ | 0 |
| sec_emp.geoip_blocks | 3.806.136 | 10 | ❌ | 0 |
| sec_emp.geoip_locations | 122.275 | 14 | ❌ | 0 |
| sec_emp.lnk_opspwds_registred_by_user | 0 | 6 | ✅ | 1 |
| sec_emp.lnk_profiles_roles | 332 | 6 | ✅ | 5 |
| sec_emp.lnk_pwds_registred_by_user | 15 | 6 | ✅ | 1 |
| sec_emp.lnk_roles_routes | 74 | 6 | ✅ | 5 |
| sec_emp.lnk_users_departments | 15 | 6 | ✅ | 2 |
| sec_emp.logs_actions_obj | 16.330 | 18 | ✅ | 0 |
| sec_emp.ms_all_countries | 250 | 9 | ✅ | 0 |
| sec_emp.ms_atc_hours | 13 | 5 | ✅ | 1 |
| sec_emp.ms_companies_competition | 39 | 8 | ✅ | 1 |
| sec_emp.ms_competition_rates | 2.472 | 12 | ✅ | 3 |
| sec_emp.ms_competitions_captures | 0 | 6 | ✅ | 1 |
| sec_emp.ms_countries | 14 | 17 | ✅ | 1 |
| sec_emp.ms_departments | 11 | 5 | ✅ | 0 |
| sec_emp.ms_doc_type | 3 | 6 | ✅ | 1 |
| sec_emp.ms_forgot_password_attempt | 0 | 6 | ✅ | 1 |
| sec_emp.ms_ip_countries | 3.802.379 | 9 | ✅ | 0 |
| sec_emp.ms_migration_error_reports | 1 | 5 | ✅ | 0 |
| sec_emp.ms_over_quota | 0 | 6 | ✅ | 1 |
| sec_emp.ms_phone | 12 | 14 | ✅ | 1 |
| sec_emp.ms_profiles | 19 | 6 | ✅ | 1 |
| sec_emp.ms_properties | 0 | 5 | ✅ | 1 |
| sec_emp.ms_roles | 70 | 5 | ✅ | 0 |
| sec_emp.ms_routes | 74 | 13 | ✅ | 1 |
| sec_emp.ms_sixmap_services | 4 | 5 | ✅ | 0 |
| sec_emp.ms_sixmap_services_utype | 5 | 6 | ✅ | 1 |
| sec_emp.ms_sixmap_users | 30 | 39 | ✅ | 6 |
| sec_emp.ms_state_countries | 573 | 3 | ✅ | 1 |
| sec_emp.ms_temp_codes | 1 | 8 | ✅ | 0 |
| sec_emp.ms_users_migrated | 1.958 | 49 | ✅ | 5 |
| sec_emp.session_obj | 4 | 52 | ✅ | 4 |
| sec_emp.v_account_type | 5 | 1 | ❌ | 0 |
| sec_emp.v_banks_accounts | 40 | 13 | ❌ | 0 |
| sec_emp.v_competition_company | 39 | 11 | ❌ | 0 |
| sec_emp.v_competition_rates | 2.472 | 14 | ❌ | 0 |
| sec_emp.v_historical_competition_rates | 2.573 | 15 | ❌ | 0 |
| sec_emp.v_pay_method | 16 | 1 | ❌ | 0 |
| sec_emp.v_ranking_competition_rates | 326 | 10 | ❌ | 0 |
| sec_emp.v_verification_level | 10.109 | 14 | ❌ | 0 |

## msg_app.lnk_atc_whatsapp_msgs {#msgapplnkatcwhatsappmsgs}

**Type:** BASE TABLE
**Row Count:** 13
**Primary Keys:** id_whatsapp_msg

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_whatsapp_msg | bigint(64) | NO | nextval('msg_app.lnk_atc_whatsapp_msgs_id_whatsapp_msg_seq'::regclass) | 64 |
| uuid_whatsapp_msg | uuid | NO | uuid_generate_v4() | - |
| id_whatsapp | character varying(40) | YES | NULL | 40 |
| msg_action | character varying(12) | NO | NULL | 12 |
| id_chat | bigint(64) | NO | NULL | 64 |
| date_whatsapp | timestamp with time zone | NO | NULL | - |
| epoch_whatsapp | bigint(64) | NO | NULL | 64 |
| attached_file | character varying(800) | YES | NULL | 800 |
| atc_respond | boolean | YES | NULL | - |
| date_created | timestamp with time zone | NO | now() | - |
| date_last_modification | timestamp with time zone | YES | NULL | - |
| uuid_sixmap_user_respond | uuid | YES | NULL | - |

### Foreign Keys

| Column | References |
|--------|------------|
| id_chat | msg_app.ms_chats_whatsapp.id_chat |

### Indexes

- **lnk_atc_whatsapp_msgs_pkey:** `CREATE UNIQUE INDEX lnk_atc_whatsapp_msgs_pkey ON msg_app.lnk_atc_whatsapp_msgs USING btree (id_whatsapp_msg)`
- **lnk_atc_whatsapp_msgs_uuid_whatsapp_msg_key:** `CREATE UNIQUE INDEX lnk_atc_whatsapp_msgs_uuid_whatsapp_msg_key ON msg_app.lnk_atc_whatsapp_msgs USING btree (uuid_whatsapp_msg)`
- **lnk_atc_whatsapp_msgs_id_whatsapp_key:** `CREATE UNIQUE INDEX lnk_atc_whatsapp_msgs_id_whatsapp_key ON msg_app.lnk_atc_whatsapp_msgs USING btree (id_whatsapp)`

---

## msg_app.lnk_default_msgs {#msgapplnkdefaultmsgs}

**Type:** BASE TABLE
**Row Count:** 54
**Primary Keys:** id_default_msg

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_default_msg | bigint(64) | NO | nextval('msg_app.lnk_default_msgs_id_default_msg_seq'::regclass) | 64 |
| active | boolean | NO | true | - |
| msg_text | text | NO | NULL | - |
| msg_title | character varying(150) | NO | NULL | 150 |
| id_default_type | integer(32) | NO | NULL | 32 |
| id_country | integer(32) | NO | NULL | 32 |

### Foreign Keys

| Column | References |
|--------|------------|
| id_default_type | msg_app.ms_default_msg_types.id_default_type |

### Indexes

- **lnk_default_msgs_pkey:** `CREATE UNIQUE INDEX lnk_default_msgs_pkey ON msg_app.lnk_default_msgs USING btree (id_default_msg)`
- **lnk_default_msgs_msg_title_id_country_key:** `CREATE UNIQUE INDEX lnk_default_msgs_msg_title_id_country_key ON msg_app.lnk_default_msgs USING btree (msg_title, id_country)`

---

## msg_app.ms_chat_events {#msgappmschatevents}

**Type:** BASE TABLE
**Row Count:** 13
**Primary Keys:** id_event

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_event | bigint(64) | NO | nextval('msg_app.ms_chat_events_id_event_seq'::regclass) | 64 |
| description | character varying(200) | NO | NULL | 200 |
| type | character varying(20) | NO | NULL | 20 |
| date_created | timestamp with time zone | NO | now() | - |
| uuid_sixmap_user | uuid | YES | NULL | - |
| id_chat | bigint(64) | NO | NULL | 64 |
| id_msg | bigint(64) | YES | NULL | 64 |

### Foreign Keys

| Column | References |
|--------|------------|
| id_chat | msg_app.ms_chats_whatsapp.id_chat |
| id_msg | msg_app.lnk_atc_whatsapp_msgs.id_whatsapp_msg |

### Indexes

- **ms_chat_events_pkey:** `CREATE UNIQUE INDEX ms_chat_events_pkey ON msg_app.ms_chat_events USING btree (id_event)`
- **ms_chat_events_id_msg_key:** `CREATE UNIQUE INDEX ms_chat_events_id_msg_key ON msg_app.ms_chat_events USING btree (id_msg)`

---

## msg_app.ms_chats_whatsapp {#msgappmschatswhatsapp}

**Type:** BASE TABLE
**Row Count:** 2
**Primary Keys:** id_chat

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_chat | bigint(64) | NO | nextval('msg_app.ms_chats_whatsapp_id_chat_seq'::regclass) | 64 |
| peer_phone | character varying(30) | YES | NULL | 30 |
| peer_phone_account | character varying(50) | YES | NULL | 50 |
| mode | character varying(10) | NO | NULL | 10 |
| id_atc_phone | bigint(64) | YES | NULL | 64 |
| id_customer_phone | bigint(64) | YES | NULL | 64 |
| uuid_user | uuid | YES | NULL | - |
| uniq_id | character varying | YES | NULL | - |
| archived | boolean | NO | false | - |

### Foreign Keys

| Column | References |
|--------|------------|
| id_atc_phone | msg_app.ms_whatsapp_atc_phones.id_phone |

### Indexes

- **ms_chats_whatsapp_pkey:** `CREATE UNIQUE INDEX ms_chats_whatsapp_pkey ON msg_app.ms_chats_whatsapp USING btree (id_chat)`

---

## msg_app.ms_chats_whatsapp_link_requests {#msgappmschatswhatsapplinkrequests}

**Type:** BASE TABLE
**Row Count:** 0
**Primary Keys:** id_link_request

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_link_request | bigint(64) | NO | nextval('msg_app.ms_chats_whatsapp_link_requests_id_link_request_seq'::regclass) | 64 |
| link_request_approved | boolean | YES | NULL | - |
| link_request_reviewed | boolean | NO | false | - |
| link_request_active | boolean | NO | true | - |
| created_date | timestamp with time zone | NO | now() | - |
| modification_date | timestamp with time zone | YES | NULL | - |
| id_chat | bigint(64) | NO | NULL | 64 |
| uuid_user_reviewed | uuid | YES | NULL | - |
| uuid_user_link | uuid | NO | NULL | - |

### Foreign Keys

| Column | References |
|--------|------------|
| id_chat | msg_app.ms_chats_whatsapp.id_chat |

### Indexes

- **ms_chats_whatsapp_link_requests_pkey:** `CREATE UNIQUE INDEX ms_chats_whatsapp_link_requests_pkey ON msg_app.ms_chats_whatsapp_link_requests USING btree (id_link_request)`

---

## msg_app.ms_default_msg_types {#msgappmsdefaultmsgtypes}

**Type:** BASE TABLE
**Row Count:** 9
**Primary Keys:** id_default_type

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_default_type | integer(32) | NO | nextval('msg_app.ms_default_msg_types_id_default_type_seq'::regclass) | 32 |
| name | character varying(20) | NO | NULL | 20 |

### Indexes

- **ms_default_msg_types_pkey:** `CREATE UNIQUE INDEX ms_default_msg_types_pkey ON msg_app.ms_default_msg_types USING btree (id_default_type)`

---

## msg_app.ms_default_range_time {#msgappmsdefaultrangetime}

**Type:** BASE TABLE
**Row Count:** 3
**Primary Keys:** id_range_time

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_range_time | integer(32) | NO | nextval('msg_app.ms_default_range_time_id_range_time_seq'::regclass) | 32 |
| name_range | character varying(30) | NO | NULL | 30 |
| epoch_range | integer(32) | NO | NULL | 32 |
| active_default | boolean | NO | NULL | - |
| active | boolean | NO | true | - |

### Indexes

- **ms_default_range_time_pkey:** `CREATE UNIQUE INDEX ms_default_range_time_pkey ON msg_app.ms_default_range_time USING btree (id_range_time)`

---

## msg_app.ms_phone_contacts {#msgappmsphonecontacts}

**Type:** BASE TABLE
**Row Count:** 7.041
**Primary Keys:** id_contact

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_contact | bigint(64) | NO | nextval('msg_app.ms_phone_contacts_id_contact_seq'::regclass) | 64 |
| phone_number | character varying | NO | NULL | - |
| first_name | character varying | NO | NULL | - |
| second_name | character varying | YES | NULL | - |
| last_name | character varying | NO | NULL | - |
| second_last_name | character varying | YES | NULL | - |
| cr_id | character varying | YES | NULL | - |
| email | character varying | YES | NULL | - |

### Indexes

- **ms_phone_contacts_pkey:** `CREATE UNIQUE INDEX ms_phone_contacts_pkey ON msg_app.ms_phone_contacts USING btree (id_contact)`

---

## msg_app.ms_whatsapp_atc_phones {#msgappmswhatsappatcphones}

**Type:** BASE TABLE
**Row Count:** 15
**Primary Keys:** id_phone

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_phone | bigint(64) | NO | nextval('msg_app.ms_whatsapp_atc_phones_id_phone_seq'::regclass) | 64 |
| atc_phone | character varying(20) | NO | NULL | 20 |
| id_country | bigint(64) | NO | NULL | 64 |
| atc_phone_acct | character varying(40) | NO | NULL | 40 |
| whatsapp_credentials | text | YES | NULL | - |
| active | boolean | NO | NULL | - |

### Indexes

- **ms_whatsapp_atc_phones_pkey:** `CREATE UNIQUE INDEX ms_whatsapp_atc_phones_pkey ON msg_app.ms_whatsapp_atc_phones USING btree (id_phone)`

---

## msg_app.ms_whatsapp_msg_json {#msgappmswhatsappmsgjson}

**Type:** BASE TABLE
**Row Count:** 11
**Primary Keys:** id_whatsapp_json

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_whatsapp_json | bigint(64) | NO | nextval('msg_app.ms_whatsapp_msg_json_id_whatsapp_json_seq'::regclass) | 64 |
| json_body | json | NO | NULL | - |
| id_whatsapp_msg | bigint(64) | NO | NULL | 64 |

### Foreign Keys

| Column | References |
|--------|------------|
| id_whatsapp_msg | msg_app.lnk_atc_whatsapp_msgs.id_whatsapp_msg |

### Indexes

- **ms_whatsapp_msg_json_pkey:** `CREATE UNIQUE INDEX ms_whatsapp_msg_json_pkey ON msg_app.ms_whatsapp_msg_json USING btree (id_whatsapp_json)`
- **ms_whatsapp_msg_json_id_whatsapp_msg_key:** `CREATE UNIQUE INDEX ms_whatsapp_msg_json_id_whatsapp_msg_key ON msg_app.ms_whatsapp_msg_json USING btree (id_whatsapp_msg)`

---

## msg_app.session_obj {#msgappsessionobj}

**Type:** BASE TABLE
**Row Count:** 4
**Primary Keys:** sid

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| sid | character varying | NO | NULL | - |
| sess | json | NO | NULL | - |
| expire | timestamp without time zone | NO | NULL | - |
| is_authenticated | boolean | YES | NULL | - |
| uuid_user | uuid | YES | NULL | - |
| username | character varying(100) | YES | NULL | 100 |
| first_name | text | YES | NULL | - |
| second_name | text | YES | NULL | - |
| last_name | text | YES | NULL | - |
| second_last_name | text | YES | NULL | - |
| email_user | character varying(100) | YES | NULL | 100 |
| password | text | YES | NULL | - |
| ops_password | text | YES | NULL | - |
| uuid_profile | uuid | YES | NULL | - |
| cust_cr_cod_pub | character varying(100) | YES | NULL | 100 |
| id_verif_level | integer(32) | YES | NULL | 32 |
| cod_rank | character varying(100) | YES | NULL | 100 |
| verif_level_apb | boolean | YES | NULL | - |
| multi_country | boolean | YES | false | - |
| last_session_reg | character varying | YES | NULL | - |
| last_ip_reg | character varying(100) | YES | NULL | 100 |
| last_ip_city_reg | character varying(100) | YES | NULL | 100 |
| last_id_log_reg | integer(32) | YES | NULL | 32 |
| date_last_conn | timestamp with time zone | YES | NULL | - |
| gender | character(1) | YES | NULL | 1 |
| date_birth | timestamp with time zone | YES | NULL | - |
| ident_doc_number | character varying(30) | YES | NULL | 30 |
| main_phone | character varying(30) | YES | NULL | 30 |
| second_phone | character varying(30) | YES | NULL | 30 |
| delegated_phone | character varying(30) | YES | NULL | 30 |
| address | text | YES | NULL | - |
| resid_city | text | YES | NULL | - |
| resid_postal_code | character varying(100) | YES | NULL | 100 |
| referral_node | character varying(30) | YES | NULL | 30 |
| main_sn_platf | character varying(30) | YES | NULL | 30 |
| ok_legal_terms | boolean | YES | NULL | - |
| user_active | boolean | YES | NULL | - |
| user_blocked | boolean | YES | NULL | - |
| date_legacy_reg | timestamp with time zone | YES | now() | - |
| date_creation | timestamp with time zone | YES | now() | - |
| date_last_modif | timestamp with time zone | YES | now() | - |
| roles | json | YES | NULL | - |
| ip_current_con | character varying(100) | YES | NULL | 100 |
| country_ip_current_con | character varying(100) | YES | NULL | 100 |
| routes | json | YES | NULL | - |
| id_user_priv | integer(32) | YES | NULL | 32 |
| id_over_quota | integer(32) | YES | NULL | 32 |
| id_service | integer(32) | YES | NULL | 32 |
| id_services_utype | integer(32) | YES | NULL | 32 |
| id_ident_doc_type | integer(32) | YES | NULL | 32 |
| id_resid_country | integer(32) | YES | NULL | 32 |
| id_nationality_country | integer(32) | YES | NULL | 32 |

### Indexes

- **session_pkey:** `CREATE UNIQUE INDEX session_pkey ON msg_app.session_obj USING btree (sid)`
- **IDX_session_expire:** `CREATE INDEX "IDX_session_expire" ON msg_app.session_obj USING btree (expire)`

---

## msg_app.v_chats_event_log {#msgappvchatseventlog}

**Type:** VIEW
**Row Count:** 13
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_event | bigint(64) | YES | NULL | 64 |
| id_chat | bigint(64) | YES | NULL | 64 |
| id_msg | bigint(64) | YES | NULL | 64 |
| type | character varying(20) | YES | NULL | 20 |
| description | character varying(200) | YES | NULL | 200 |
| date_created | timestamp with time zone | YES | NULL | - |
| uuid_sixmap_user | uuid | YES | NULL | - |
| first_name | character varying(100) | YES | NULL | 100 |
| last_name | character varying(100) | YES | NULL | 100 |

---

## msg_app.v_chats_info {#msgappvchatsinfo}

**Type:** VIEW
**Row Count:** 0
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_chat | bigint(64) | YES | NULL | 64 |
| customer_phone | character varying(30) | YES | NULL | 30 |
| id_connection | bigint(64) | YES | NULL | 64 |
| respond | boolean | YES | NULL | - |
| consult | boolean | YES | NULL | - |
| requests_in_progress | ARRAY | YES | NULL | - |
| last_consult_create_date | timestamp with time zone | YES | NULL | - |
| id_customer | bigint(64) | YES | NULL | 64 |
| customer_name | character varying(100) | YES | NULL | 100 |
| customer_last_name | character varying(100) | YES | NULL | 100 |
| customer_email | character varying(100) | YES | NULL | 100 |
| customer_public_cod | character varying | YES | NULL | - |
| username_asing | character varying(100) | YES | NULL | 100 |
| name_asing | character varying(100) | YES | NULL | 100 |
| lastname_asing | character varying(100) | YES | NULL | 100 |
| verify_level | integer(32) | YES | NULL | 32 |
| country | character varying(255) | YES | NULL | 255 |
| id_country | bigint(64) | YES | NULL | 64 |
| country_code | character varying(20) | YES | NULL | 20 |
| last_consult_close_date | timestamp with time zone | YES | NULL | - |
| ident_number | character varying(30) | YES | NULL | 30 |
| doc_type | character varying(50) | YES | NULL | 50 |
| level | character varying | YES | NULL | - |
| last_remittance_open | bigint(64) | YES | NULL | 64 |
| last_remittance_close | bigint(64) | YES | NULL | 64 |
| mode | character varying(10) | YES | NULL | 10 |
| uniq_id | character varying | YES | NULL | - |
| archived | boolean | YES | NULL | - |
| requests_finished | ARRAY | YES | NULL | - |
| id_risk_level | integer(32) | YES | NULL | 32 |
| id_loyalty_level | integer(32) | YES | NULL | 32 |
| migration_status | character varying | YES | NULL | - |
| msg_no_resp | bigint(64) | YES | NULL | 64 |
| id_user_asing | bigint(64) | YES | NULL | 64 |
| uuid_user_asing | uuid | YES | NULL | - |

---

## msg_app.v_msg {#msgappvmsg}

**Type:** VIEW
**Row Count:** 13
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id | bigint(64) | YES | NULL | 64 |
| whatsapp_id_msg | character varying(40) | YES | NULL | 40 |
| action | character varying(12) | YES | NULL | 12 |
| id_chat | bigint(64) | YES | NULL | 64 |
| date_msg | timestamp with time zone | YES | NULL | - |
| respond | boolean | YES | NULL | - |
| username_resp | character varying(100) | YES | NULL | 100 |
| msg | json | YES | NULL | - |
| atc_user_name | character varying(100) | YES | NULL | 100 |
| atc_user_last_name | character varying(100) | YES | NULL | 100 |
| atc_user_fake_name | character varying(200) | YES | NULL | 200 |
| event_type | character varying(20) | YES | NULL | 20 |
| description | character varying(200) | YES | NULL | 200 |
| profile | character varying(20) | YES | NULL | 20 |
| epoch_msg | bigint(64) | YES | NULL | 64 |
| attached_file | character varying(800) | YES | NULL | 800 |

---

## msg_app.v_phones_with_country {#msgappvphoneswithcountry}

**Type:** VIEW
**Row Count:** 14
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_phone | bigint(64) | YES | NULL | 64 |
| phone | character varying(20) | YES | NULL | 20 |
| account | character varying(40) | YES | NULL | 40 |
| id_country | bigint(64) | YES | NULL | 64 |
| country | character varying(255) | YES | NULL | 255 |
| credential | text | YES | NULL | - |

---

## ord_sch.lnk_currencies_pairs_offers {#ordschlnkcurrenciespairsoffers}

**Type:** BASE TABLE
**Row Count:** 5.678
**Primary Keys:** id_offer

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_offer | uuid | NO | uuid_generate_v4() | - |
| type_offer | character varying(4) | NO | NULL | 4 |
| adv_no | character varying(30) | YES | NULL | 30 |
| price | double precision(53) | NO | NULL | 53 |
| max_trans_amount | double precision(53) | YES | NULL | 53 |
| min_trans_amount | double precision(53) | YES | NULL | 53 |
| max_trans_quantity | double precision(53) | YES | NULL | 53 |
| min_trans_quantity | double precision(53) | YES | NULL | 53 |
| init_amount | double precision(53) | YES | NULL | 53 |
| tradable_quantity | double precision(53) | NO | NULL | 53 |
| classify | character varying(200) | YES | NULL | 200 |
| fiat_symbol | character varying(5) | YES | NULL | 5 |
| is_tradeble | boolean | YES | NULL | - |
| commission_rate | double precision(53) | YES | NULL | 53 |
| auto_reply_msg | text | YES | NULL | - |
| user_grade | integer(32) | YES | NULL | 32 |
| total_orders_count | character varying(10) | YES | NULL | 10 |
| orders_rate | double precision(53) | YES | NULL | 53 |
| username | character varying(100) | YES | NULL | 100 |
| id_exchange | integer(32) | NO | NULL | 32 |
| id_consult | bigint(64) | NO | NULL | 64 |
| id_pair | integer(32) | NO | NULL | 32 |

### Foreign Keys

| Column | References |
|--------|------------|
| id_consult | ord_sch.ms_consults.id_consult |
| id_exchange | ord_sch.ms_exchanges.id_exchange |
| id_pair | ord_sch.ms_currencies_pairs.id_pair |

### Indexes

- **lnk_currencies_pairs_offers_pkey:** `CREATE UNIQUE INDEX lnk_currencies_pairs_offers_pkey ON ord_sch.lnk_currencies_pairs_offers USING btree (id_offer)`

---

## ord_sch.ms_consults {#ordschmsconsults}

**Type:** BASE TABLE
**Row Count:** 258
**Primary Keys:** id_consult

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_consult | bigint(64) | NO | nextval('ord_sch.ms_consults_id_consult_seq'::regclass) | 64 |
| date | timestamp with time zone | NO | now() | - |
| current_active | boolean | NO | true | - |
| type_offer | character varying(10) | NO | NULL | 10 |

### Indexes

- **ms_consults_pkey:** `CREATE UNIQUE INDEX ms_consults_pkey ON ord_sch.ms_consults USING btree (id_consult)`

---

## ord_sch.ms_cost_rates {#ordschmscostrates}

**Type:** BASE TABLE
**Row Count:** 1.821
**Primary Keys:** id_cost_rate

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_cost_rate | bigint(64) | NO | nextval('ord_sch.ms_cost_rates_id_cost_rate_seq'::regclass) | 64 |
| id_operation_route | bigint(64) | NO | NULL | 64 |
| rate_value | double precision(53) | NO | NULL | 53 |
| updated_group | bigint(64) | NO | NULL | 64 |
| active | boolean | YES | true | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |

### Indexes

- **ms_cost_rates_pkey:** `CREATE UNIQUE INDEX ms_cost_rates_pkey ON ord_sch.ms_cost_rates USING btree (id_cost_rate)`

---

## ord_sch.ms_currencies_pairs {#ordschmscurrenciespairs}

**Type:** BASE TABLE
**Row Count:** 20
**Primary Keys:** id_pair

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_pair | integer(32) | NO | nextval('ord_sch.ms_currencies_pairs_id_pair_seq'::regclass) | 32 |
| pair_name | character varying(10) | NO | NULL | 10 |
| id_fiat_currency | integer(32) | NO | NULL | 32 |
| id_crypto_currency | integer(32) | NO | NULL | 32 |
| active | boolean | NO | true | - |
| active_binance | boolean | NO | NULL | - |
| active_localbitcoins | boolean | NO | NULL | - |
| active_buda | boolean | NO | NULL | - |
| active_foxbit | boolean | NO | NULL | - |
| active_kraken | boolean | NO | NULL | - |
| active_criptomarket | boolean | NO | NULL | - |

### Indexes

- **ms_currencies_pairs_pkey:** `CREATE UNIQUE INDEX ms_currencies_pairs_pkey ON ord_sch.ms_currencies_pairs USING btree (id_pair)`

---

## ord_sch.ms_currency_risks {#ordschmscurrencyrisks}

**Type:** BASE TABLE
**Row Count:** 18
**Primary Keys:** id_risk

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_risk | bigint(64) | NO | nextval('ord_sch.ms_currency_risks_id_risk_seq'::regclass) | 64 |
| risk | double precision(53) | NO | NULL | 53 |
| type | character varying | NO | NULL | - |
| id_currency | bigint(64) | YES | NULL | 64 |
| active | boolean | YES | true | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |

### Indexes

- **ms_currency_risks_pkey:** `CREATE UNIQUE INDEX ms_currency_risks_pkey ON ord_sch.ms_currency_risks USING btree (id_risk)`

---

## ord_sch.ms_exchange_maker_taker_fees {#ordschmsexchangemakertakerfees}

**Type:** BASE TABLE
**Row Count:** 24
**Primary Keys:** id_exchange_fee

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_exchange_fee | integer(32) | NO | nextval('ord_sch.ms_exchange_maker_taker_fees_id_exchange_fee_seq'::regclass) | 32 |
| maker_fee | double precision(53) | NO | NULL | 53 |
| taker_fee | double precision(53) | NO | NULL | 53 |
| id_exchange | integer(32) | NO | NULL | 32 |
| id_fiat_currency | integer(32) | NO | NULL | 32 |

### Foreign Keys

| Column | References |
|--------|------------|
| id_exchange | ord_sch.ms_exchanges.id_exchange |

### Indexes

- **ms_exchange_maker_taker_fees_pkey:** `CREATE UNIQUE INDEX ms_exchange_maker_taker_fees_pkey ON ord_sch.ms_exchange_maker_taker_fees USING btree (id_exchange_fee)`

---

## ord_sch.ms_exchange_orders {#ordschmsexchangeorders}

**Type:** BASE TABLE
**Row Count:** 2.450
**Primary Keys:** id_order

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_order | uuid | NO | uuid_generate_v4() | - |
| price | double precision(53) | NO | NULL | 53 |
| tradable_quantity | double precision(53) | NO | NULL | 53 |
| type_offer | character varying(4) | NO | NULL | 4 |
| id_pair | integer(32) | NO | NULL | 32 |
| id_exchange | integer(32) | NO | NULL | 32 |
| id_consult | bigint(64) | NO | NULL | 64 |

### Foreign Keys

| Column | References |
|--------|------------|
| id_consult | ord_sch.ms_consults.id_consult |
| id_exchange | ord_sch.ms_exchanges.id_exchange |
| id_pair | ord_sch.ms_currencies_pairs.id_pair |

### Indexes

- **ms_exchange_orders_pkey:** `CREATE UNIQUE INDEX ms_exchange_orders_pkey ON ord_sch.ms_exchange_orders USING btree (id_order)`

---

## ord_sch.ms_exchanges {#ordschmsexchanges}

**Type:** BASE TABLE
**Row Count:** 9
**Primary Keys:** id_exchange

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_exchange | integer(32) | NO | nextval('ord_sch.ms_exchanges_id_exchange_seq'::regclass) | 32 |
| name | character varying(200) | NO | NULL | 200 |
| active | boolean | NO | true | - |

### Indexes

- **ms_exchanges_pkey:** `CREATE UNIQUE INDEX ms_exchanges_pkey ON ord_sch.ms_exchanges USING btree (id_exchange)`

---

## ord_sch.ms_extract_data {#ordschmsextractdata}

**Type:** BASE TABLE
**Row Count:** 258
**Primary Keys:** id_data

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_data | bigint(64) | NO | nextval('ord_sch.ms_extract_data_id_data_seq'::regclass) | 64 |
| json_data | ARRAY | NO | NULL | - |
| id_exchange | integer(32) | NO | NULL | 32 |
| id_consult | integer(32) | NO | NULL | 32 |
| id_pair | integer(32) | NO | NULL | 32 |

### Foreign Keys

| Column | References |
|--------|------------|
| id_consult | ord_sch.ms_consults.id_consult |
| id_exchange | ord_sch.ms_exchanges.id_exchange |
| id_pair | ord_sch.ms_currencies_pairs.id_pair |

### Indexes

- **ms_extract_data_pkey:** `CREATE UNIQUE INDEX ms_extract_data_pkey ON ord_sch.ms_extract_data USING btree (id_data)`
- **ms_extract_data_id_consult_key:** `CREATE UNIQUE INDEX ms_extract_data_id_consult_key ON ord_sch.ms_extract_data USING btree (id_consult)`

---

## ord_sch.ms_market_fees {#ordschmsmarketfees}

**Type:** BASE TABLE
**Row Count:** 24
**Primary Keys:** id_market_fees

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_market_fees | bigint(64) | NO | nextval('ord_sch.ms_market_fees_id_market_fees_seq'::regclass) | 64 |
| fee | double precision(53) | NO | NULL | 53 |
| id_platform | bigint(64) | YES | NULL | 64 |
| id_country | bigint(64) | YES | NULL | 64 |
| id_market_type | bigint(64) | YES | NULL | 64 |
| id_order_type | bigint(64) | NO | NULL | 64 |
| active | boolean | YES | true | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |

### Foreign Keys

| Column | References |
|--------|------------|
| id_market_type | ord_sch.ms_market_types.id_market_type |
| id_order_type | ord_sch.ms_order_types.id_order_type |
| id_platform | ord_sch.ms_exchanges.id_exchange |

### Indexes

- **ms_market_fees_pkey:** `CREATE UNIQUE INDEX ms_market_fees_pkey ON ord_sch.ms_market_fees USING btree (id_market_fees)`

---

## ord_sch.ms_market_rates {#ordschmsmarketrates}

**Type:** BASE TABLE
**Row Count:** 528
**Primary Keys:** id_market_rates

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_market_rates | bigint(64) | NO | nextval('ord_sch.ms_market_rates_id_market_rates_seq'::regclass) | 64 |
| id_currency | bigint(64) | NO | NULL | 64 |
| buy_rate | double precision(53) | NO | NULL | 53 |
| id_buy_fee | bigint(64) | NO | NULL | 64 |
| sell_rate | double precision(53) | NO | NULL | 53 |
| id_sell_fee | bigint(64) | NO | NULL | 64 |
| final_buy_rate | double precision(53) | NO | NULL | 53 |
| final_sell_rate | double precision(53) | NO | NULL | 53 |
| current_fiat_crypto_rate | double precision(53) | YES | NULL | 53 |
| percentage_difference | double precision(53) | YES | NULL | 53 |
| current_usd_fiat_rate | double precision(53) | YES | NULL | 53 |
| active | boolean | YES | true | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |

### Foreign Keys

| Column | References |
|--------|------------|
| id_buy_fee | ord_sch.ms_market_fees.id_market_fees |
| id_sell_fee | ord_sch.ms_market_fees.id_market_fees |

### Indexes

- **ms_market_rates_pkey:** `CREATE UNIQUE INDEX ms_market_rates_pkey ON ord_sch.ms_market_rates USING btree (id_market_rates)`

---

## ord_sch.ms_market_types {#ordschmsmarkettypes}

**Type:** BASE TABLE
**Row Count:** 2
**Primary Keys:** id_market_type

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_market_type | bigint(64) | NO | nextval('ord_sch.ms_market_types_id_market_type_seq'::regclass) | 64 |
| name | character varying | NO | NULL | - |
| active | boolean | YES | true | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |

### Indexes

- **ms_market_types_pkey:** `CREATE UNIQUE INDEX ms_market_types_pkey ON ord_sch.ms_market_types USING btree (id_market_type)`

---

## ord_sch.ms_order_types {#ordschmsordertypes}

**Type:** BASE TABLE
**Row Count:** 2
**Primary Keys:** id_order_type

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_order_type | bigint(64) | NO | nextval('ord_sch.ms_order_types_id_order_type_seq'::regclass) | 64 |
| name | character varying | YES | NULL | - |
| active | boolean | YES | true | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |

### Indexes

- **ms_order_types_pkey:** `CREATE UNIQUE INDEX ms_order_types_pkey ON ord_sch.ms_order_types USING btree (id_order_type)`

---

## ord_sch.ms_pay_methods {#ordschmspaymethods}

**Type:** BASE TABLE
**Row Count:** 16.270
**Primary Keys:** id_pay_method

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_pay_method | bigint(64) | NO | nextval('ord_sch.ms_pay_methods_id_pay_method_seq'::regclass) | 64 |
| name | text | YES | NULL | - |
| id_offer | uuid | NO | NULL | - |

### Foreign Keys

| Column | References |
|--------|------------|
| id_offer | ord_sch.lnk_currencies_pairs_offers.id_offer |

### Indexes

- **ms_pay_methods_pkey:** `CREATE UNIQUE INDEX ms_pay_methods_pkey ON ord_sch.ms_pay_methods USING btree (id_pay_method)`

---

## ord_sch.ms_public_fees {#ordschmspublicfees}

**Type:** BASE TABLE
**Row Count:** 336
**Primary Keys:** id_public_fee

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_public_fee | bigint(64) | NO | nextval('ord_sch.ms_public_fees_id_public_fee_seq'::regclass) | 64 |
| fee | double precision(53) | NO | NULL | 53 |
| id_rate | bigint(64) | YES | NULL | 64 |
| id_route | bigint(64) | YES | NULL | 64 |
| active | boolean | YES | true | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |

### Indexes

- **ms_public_fees_pkey:** `CREATE UNIQUE INDEX ms_public_fees_pkey ON ord_sch.ms_public_fees USING btree (id_public_fee)`

---

## ord_sch.v_active_consults {#ordschvactiveconsults}

**Type:** VIEW
**Row Count:** 56
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_consult | bigint(64) | YES | NULL | 64 |
| date | timestamp with time zone | YES | NULL | - |
| id_exchange | integer(32) | YES | NULL | 32 |
| id_pair | integer(32) | YES | NULL | 32 |
| type_offer | character varying(10) | YES | NULL | 10 |

---

## ord_sch.v_active_offers {#ordschvactiveoffers}

**Type:** VIEW
**Row Count:** 1.744
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_offer | uuid | YES | NULL | - |
| type_offer | character varying(4) | YES | NULL | 4 |
| adv_no | character varying(30) | YES | NULL | 30 |
| price | double precision(53) | YES | NULL | 53 |
| max_trans_amount | double precision(53) | YES | NULL | 53 |
| min_trans_amount | double precision(53) | YES | NULL | 53 |
| id_exchange | integer(32) | YES | NULL | 32 |
| id_consult | bigint(64) | YES | NULL | 64 |
| id_pair | integer(32) | YES | NULL | 32 |
| date | timestamp with time zone | YES | NULL | - |
| user_grade | integer(32) | YES | NULL | 32 |
| total_orders_count | character varying(10) | YES | NULL | 10 |
| orders_rate | double precision(53) | YES | NULL | 53 |
| username | character varying(100) | YES | NULL | 100 |

---

## ord_sch.v_active_orders {#ordschvactiveorders}

**Type:** VIEW
**Row Count:** 350
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_order | uuid | YES | NULL | - |
| type_offer | character varying(4) | YES | NULL | 4 |
| price | double precision(53) | YES | NULL | 53 |
| id_exchange | integer(32) | YES | NULL | 32 |
| id_pair | integer(32) | YES | NULL | 32 |
| date | timestamp with time zone | YES | NULL | - |
| id_consult | bigint(64) | YES | NULL | 64 |

---

## ord_sch.v_currencies_pairs {#ordschvcurrenciespairs}

**Type:** VIEW
**Row Count:** 20
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_pair | integer(32) | YES | NULL | 32 |
| name | character varying(10) | YES | NULL | 10 |
| fiat_cod | character varying(5) | YES | NULL | 5 |
| crypto_cod | character varying(5) | YES | NULL | 5 |
| fiat_country_name | character varying(255) | YES | NULL | 255 |
| fiat_id_country | integer(32) | YES | NULL | 32 |
| active_binance | boolean | YES | NULL | - |
| active_localbitcoins | boolean | YES | NULL | - |
| active_buda | boolean | YES | NULL | - |
| active_foxbit | boolean | YES | NULL | - |
| active_kraken | boolean | YES | NULL | - |

---

## ord_sch.v_exchanges {#ordschvexchanges}

**Type:** VIEW
**Row Count:** 9
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_exchange | integer(32) | YES | NULL | 32 |
| name | character varying(200) | YES | NULL | 200 |

---

## ord_sch.v_exchanges_fee_comparative {#ordschvexchangesfeecomparative}

**Type:** VIEW
**Row Count:** 27
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| exchange | text | YES | NULL | - |
| id_exchange | integer(32) | YES | NULL | 32 |
| pair_name | character varying(10) | YES | NULL | 10 |
| id_pair | integer(32) | YES | NULL | 32 |
| market_fee | double precision(53) | YES | NULL | 53 |
| limit_fee | double precision(53) | YES | NULL | 53 |
| spread_fee | double precision(53) | YES | NULL | 53 |
| fiat_iso_cod | character varying(5) | YES | NULL | 5 |
| id_fiat_currency | integer(32) | YES | NULL | 32 |

---

## prc_mng.exchanges_responses {#prcmngexchangesresponses}

**Type:** BASE TABLE
**Row Count:** 0
**Primary Keys:** id_exchange_response

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_exchange_response | bigint(64) | NO | nextval('prc_mng.exchanges_responses_id_exchange_response_seq'::regclass) | 64 |
| response | json | YES | NULL | - |
| id_exchange_pub | character varying | YES | NULL | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |

### Foreign Keys

| Column | References |
|--------|------------|
| id_exchange_pub | prc_mng.lnk_cr_exchanges.id_exchange_pub |

### Indexes

- **exchanges_responses_pkey:** `CREATE UNIQUE INDEX exchanges_responses_pkey ON prc_mng.exchanges_responses USING btree (id_exchange_response)`

---

## prc_mng.lnk_amount_limits {#prcmnglnkamountlimits}

**Type:** BASE TABLE
**Row Count:** 380
**Primary Keys:** id_amount_limit

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_amount_limit | bigint(64) | NO | nextval('prc_mng.lnk_amount_limits_id_amount_limit_seq'::regclass) | 64 |
| amount_limit | double precision(53) | NO | NULL | 53 |
| type | character varying | NO | NULL | - |
| id_operation_route | integer(32) | YES | NULL | 32 |
| id_exchange_type | integer(32) | NO | NULL | 32 |
| id_verification | integer(32) | YES | NULL | 32 |
| active | boolean | NO | true | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |

### Foreign Keys

| Column | References |
|--------|------------|
| id_exchange_type | prc_mng.ms_exchange_types.id_exchange_type |
| id_operation_route | prc_mng.ms_operation_routes.id_operation_route |

### Indexes

- **lnk_amount_limits_pkey:** `CREATE UNIQUE INDEX lnk_amount_limits_pkey ON prc_mng.lnk_amount_limits USING btree (id_amount_limit)`

---

## prc_mng.lnk_bank_account_initial_balances {#prcmnglnkbankaccountinitialbalances}

**Type:** BASE TABLE
**Row Count:** 41
**Primary Keys:** id_initial_balance

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_initial_balance | bigint(64) | NO | nextval('prc_mng.lnk_bank_account_initial_balances_id_initial_balance_seq'::regclass) | 64 |
| id_bank_account | bigint(64) | NO | NULL | 64 |
| amount | double precision(53) | NO | NULL | 53 |
| id_balance | bigint(64) | NO | NULL | 64 |

### Foreign Keys

| Column | References |
|--------|------------|
| id_balance | prc_mng.ms_cycle_balances.id_balance |

### Indexes

- **lnk_bank_account_initial_balances_pkey:** `CREATE UNIQUE INDEX lnk_bank_account_initial_balances_pkey ON prc_mng.lnk_bank_account_initial_balances USING btree (id_initial_balance)`

---

## prc_mng.lnk_buy_cycle_currencies {#prcmnglnkbuycyclecurrencies}

**Type:** BASE TABLE
**Row Count:** 9
**Primary Keys:** id_buy_cycle_currency

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_buy_cycle_currency | bigint(64) | NO | nextval('prc_mng.lnk_buy_cycle_currencies_id_buy_cycle_currency_seq'::regclass) | 64 |
| id_buy_cycle | bigint(64) | NO | NULL | 64 |
| id_currency | bigint(64) | NO | NULL | 64 |

### Foreign Keys

| Column | References |
|--------|------------|
| id_buy_cycle | prc_mng.ms_buy_cycles.id_buy_cycle |

### Indexes

- **lnk_buy_cycle_currencies_pkey:** `CREATE UNIQUE INDEX lnk_buy_cycle_currencies_pkey ON prc_mng.lnk_buy_cycle_currencies USING btree (id_buy_cycle_currency)`

---

## prc_mng.lnk_buy_cycle_operations {#prcmnglnkbuycycleoperations}

**Type:** BASE TABLE
**Row Count:** 3
**Primary Keys:** id_buy_operation

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_buy_operation | bigint(64) | NO | nextval('prc_mng.lnk_buy_cycle_operations_id_buy_operation_seq'::regclass) | 64 |
| date_created | timestamp with time zone | NO | now() | - |
| id_buy_cycle | bigint(64) | YES | NULL | 64 |
| id_origin_currency | bigint(64) | NO | NULL | 64 |
| id_exchange | integer(32) | NO | NULL | 32 |
| id_crypto_currency | bigint(64) | NO | NULL | 64 |
| id_bank_account | bigint(64) | YES | NULL | 64 |
| fiat_amount_used | double precision(53) | NO | NULL | 53 |
| crypto_amount_obtained | double precision(53) | NO | NULL | 53 |
| rate_price | double precision(53) | NO | NULL | 53 |
| operation_cod | character varying | NO | NULL | - |
| uuid_sixmap_user | uuid | NO | NULL | - |
| btc_amount_obtained | double precision(53) | YES | NULL | 53 |
| btc_rate_price | double precision(53) | YES | NULL | 53 |
| id_exchange_account | bigint(64) | NO | NULL | 64 |
| merchant_type | character varying | YES | NULL | - |
| fee_type | character varying | YES | NULL | - |
| op_ex_number | character varying | YES | NULL | - |
| ex_user | character varying | YES | NULL | - |
| ex_username | character varying | YES | NULL | - |
| id_ex_ident_type | integer(32) | YES | NULL | 32 |
| ex_ident_number | character varying | YES | NULL | - |
| id_ex_bank | integer(32) | YES | NULL | 32 |
| ex_bank_account | character varying | YES | NULL | - |
| ex_bank_account_holder | character varying | YES | NULL | - |
| ex_holder_ident_number_type | character varying | YES | NULL | - |
| ex_holder_ident_number | character varying | YES | NULL | - |
| ex_bank_verif_cod | character varying | YES | NULL | - |
| path_name | character varying | YES | NULL | - |
| btc_close | boolean | NO | true | - |

### Foreign Keys

| Column | References |
|--------|------------|
| id_buy_cycle | prc_mng.ms_buy_cycles.id_buy_cycle |
| id_exchange_account | prc_mng.ms_exchange_accounts.id_account |

### Indexes

- **lnk_buy_cycle_operations_pkey:** `CREATE UNIQUE INDEX lnk_buy_cycle_operations_pkey ON prc_mng.lnk_buy_cycle_operations USING btree (id_buy_operation)`

---

## prc_mng.lnk_cr_exchanges {#prcmnglnkcrexchanges}

**Type:** BASE TABLE
**Row Count:** 0
**Primary Keys:** id_exchange

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_exchange | bigint(64) | NO | nextval('prc_mng.lnk_cr_exchanges_id_exchange_seq'::regclass) | 64 |
| id_exchange_pub | character varying | NO | NULL | - |
| uuid_request | uuid | NO | uuid_generate_v4() | - |
| id_client | integer(32) | NO | NULL | 32 |
| id_pay_method | integer(32) | YES | NULL | 32 |
| id_bank_account | integer(32) | YES | NULL | 32 |
| origin_deposit_amount | double precision(53) | NO | NULL | 53 |
| origin_fee | double precision(53) | YES | NULL | 53 |
| total_origin_amount | double precision(53) | NO | NULL | 53 |
| total_destiny_amount | double precision(53) | NO | NULL | 53 |
| total_origin_local_amount | double precision(53) | YES | NULL | 53 |
| total_origin_dollar_amount | double precision(53) | YES | NULL | 53 |
| mode | character varying | YES | NULL | - |
| transf_to_client_conf_num | character varying | YES | NULL | - |
| transf_to_client_cap | text | YES | NULL | - |
| id_exchange_rate | integer(32) | YES | NULL | 32 |
| id_exchange_type | integer(32) | YES | NULL | 32 |
| id_operation_route | integer(32) | YES | NULL | 32 |
| id_network | integer(32) | YES | NULL | 32 |
| id_ppl_status | integer(32) | NO | NULL | 32 |
| id_pub_status | integer(32) | NO | NULL | 32 |
| id_rev_status | integer(32) | NO | NULL | 32 |
| id_bank_verif_status | integer(32) | NO | NULL | 32 |
| id_pause_status | integer(32) | NO | NULL | 32 |
| id_buy_cycle_status | integer(32) | NO | NULL | 32 |
| id_sell_cycle_status | integer(32) | NO | NULL | 32 |
| id_claim_status | integer(32) | NO | NULL | 32 |
| id_ok_transf_status | integer(32) | NO | NULL | 32 |
| id_transf_status | integer(32) | NO | NULL | 32 |
| id_ok_award_status | integer(32) | NO | NULL | 32 |
| id_award_status | integer(32) | NO | NULL | 32 |
| id_notif_client_status | integer(32) | NO | NULL | 32 |
| id_modified_status | integer(32) | NO | NULL | 32 |
| id_buy_cycle | integer(32) | YES | NULL | 32 |
| id_sell_cycle | integer(32) | YES | NULL | 32 |
| modif_version | integer(32) | NO | 1 | 32 |
| id_user_account | integer(32) | YES | NULL | 32 |
| id_user_wallet | integer(32) | YES | NULL | 32 |
| id_destiny_user_wallet | integer(32) | YES | NULL | 32 |
| id_company_wallet | integer(32) | YES | NULL | 32 |
| auto_confirm | boolean | YES | NULL | - |
| funds_in_wallet_check | boolean | YES | true | - |
| conversion_price | double precision(53) | YES | NULL | 53 |
| active | boolean | NO | true | - |
| external_transaction_status | character varying | YES | NULL | - |
| date_created | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |
| date_closed | timestamp with time zone | YES | NULL | - |

### Foreign Keys

| Column | References |
|--------|------------|
| id_award_status | prc_mng.ms_exchange_award_status.id_award_status |
| id_bank_verif_status | prc_mng.ms_exchange_bank_verif_status.id_bank_verif_status |
| id_buy_cycle | prc_mng.ms_buy_cycles.id_buy_cycle |
| id_buy_cycle_status | prc_mng.ms_exchange_buy_cycle_status.id_buy_cycle_status |
| id_claim_status | prc_mng.ms_exchange_claim_status.id_claim_status |
| id_exchange_rate | prc_mng.ms_exchange_rates.id_exchange_rate |
| id_exchange_type | prc_mng.ms_exchange_types.id_exchange_type |
| id_modified_status | prc_mng.ms_exchange_modified_status.id_modified_status |
| id_network | prc_mng.ms_networks.id_network |
| id_notif_client_status | prc_mng.ms_exchange_notif_client_status.id_notif_client_status |
| id_ok_award_status | prc_mng.ms_exchange_ok_award_status.id_ok_award_status |
| id_ok_transf_status | prc_mng.ms_exchange_ok_transf_status.id_ok_transf_status |
| id_operation_route | prc_mng.ms_operation_routes.id_operation_route |
| id_pause_status | prc_mng.ms_exchange_pause_status.id_pause_status |
| id_ppl_status | prc_mng.ms_exchange_principal_status.id_ppl_status |
| id_pub_status | prc_mng.ms_exchange_public_status.id_pub_status |
| id_rev_status | prc_mng.ms_exchange_atc_revision_status.id_rev_status |
| id_sell_cycle | prc_mng.ms_sell_cycles.id_sell_cycle |
| id_sell_cycle_status | prc_mng.ms_exchange_sell_cycle_status.id_sell_cycle_status |
| id_transf_status | prc_mng.ms_exchange_transf_status.id_transf_status |

### Indexes

- **lnk_cr_exchanges_pkey:** `CREATE UNIQUE INDEX lnk_cr_exchanges_pkey ON prc_mng.lnk_cr_exchanges USING btree (id_exchange)`
- **lnk_cr_exchanges_id_exchange_pub_key:** `CREATE UNIQUE INDEX lnk_cr_exchanges_id_exchange_pub_key ON prc_mng.lnk_cr_exchanges USING btree (id_exchange_pub)`
- **lnk_cr_exchanges_uuid_request_key:** `CREATE UNIQUE INDEX lnk_cr_exchanges_uuid_request_key ON prc_mng.lnk_cr_exchanges USING btree (uuid_request)`

---

## prc_mng.lnk_cr_remittances {#prcmnglnkcrremittances}

**Type:** BASE TABLE
**Row Count:** 202
**Primary Keys:** id_remittance

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_remittance | bigint(64) | NO | nextval('prc_mng.lnk_cr_remittances_id_remittance_seq'::regclass) | 64 |
| id_remittance_pub | character varying(20) | NO | NULL | 20 |
| uuid_request | uuid | NO | uuid_generate_v4() | - |
| id_client | integer(32) | NO | NULL | 32 |
| id_account | integer(32) | YES | NULL | 32 |
| origin_deposit_amount | double precision(53) | NO | NULL | 53 |
| origin_comission | double precision(53) | NO | NULL | 53 |
| total_origin_amount | double precision(53) | NO | NULL | 53 |
| id_rate | integer(32) | YES | NULL | 32 |
| id_manual_rate | integer(32) | YES | NULL | 32 |
| id_special_rate | integer(32) | YES | NULL | 32 |
| id_vip_rate | integer(32) | YES | NULL | 32 |
| total_destiny_amount | double precision(53) | NO | NULL | 53 |
| date_created | timestamp with time zone | NO | now() | - |
| cr_rem_status_ppl | character varying(30) | NO | NULL | 30 |
| cr_rem_status_sec | character varying(30) | NO | NULL | 30 |
| cr_rem_status_detour | character varying(30) | YES | NULL | 30 |
| cr_rem_status_notif_cust | boolean | NO | false | - |
| notepad | ARRAY | YES | NULL | - |
| total_origin_local_amount | double precision(53) | YES | NULL | 53 |
| total_origin_dollar_amount | double precision(53) | YES | NULL | 53 |
| date_closed | timestamp with time zone | YES | NULL | - |
| public_status | character varying | YES | 'En Proceso'::character varying | - |
| mode | character varying | YES | NULL | - |
| id_ppl_status | integer(32) | NO | 2 | 32 |
| id_pub_status | integer(32) | NO | 1 | 32 |
| id_rev_status | integer(32) | NO | 1 | 32 |
| id_ver_status | integer(32) | NO | 1 | 32 |
| id_pas_status | integer(32) | NO | 4 | 32 |
| id_buy_cycle_status | integer(32) | NO | 1 | 32 |
| id_sell_cycle_status | integer(32) | NO | 1 | 32 |
| id_claim_status | integer(32) | NO | 2 | 32 |
| id_notif_status | integer(32) | NO | 1 | 32 |
| to_tranf | boolean | NO | false | - |
| tranf | boolean | NO | false | - |
| notif_client | boolean | NO | false | - |
| rem_modif | boolean | NO | false | - |
| modif_version | integer(32) | NO | 1 | 32 |
| wholesale_partner_profit | double precision(53) | YES | NULL | 53 |
| wholesale_partner_profit_local_currency | double precision(53) | YES | NULL | 53 |
| wholesale_partner_profit_dollar | double precision(53) | YES | NULL | 53 |
| total_wholesale_partner_origin_amount | double precision(53) | YES | NULL | 53 |
| date_last_modif | timestamp with time zone | YES | NULL | - |
| id_buy_cycle | bigint(64) | YES | NULL | 64 |
| id_sell_cycle | bigint(64) | YES | NULL | 64 |
| uuid_sixmap_user | uuid | YES | NULL | - |
| priority | boolean | NO | false | - |
| urgent | boolean | NO | false | - |
| usd_origin_rate | double precision(53) | YES | NULL | 53 |

### Foreign Keys

| Column | References |
|--------|------------|
| id_buy_cycle_status | prc_mng.ms_remittance_buy_cycle_status.id_buy_cycle_status |
| id_claim_status | prc_mng.ms_remittance_claim_status.id_claim_status |
| id_notif_status | prc_mng.ms_remittance_notif_benef_status.id_notif_status |
| id_pas_status | prc_mng.ms_remittance_pause_status.id_pas_status |
| id_ppl_status | prc_mng.ms_remittance_principal_status.id_ppl_status |
| id_pub_status | prc_mng.ms_remittance_public_status.id_pub_status |
| id_rev_status | prc_mng.ms_remittance_revision_status.id_rev_status |
| id_sell_cycle_status | prc_mng.ms_remittance_sell_cycle_status.id_sell_cycle_status |
| id_ver_status | prc_mng.ms_remittance_bank_verif_status.id_ver_status |
| id_buy_cycle | prc_mng.ms_buy_cycles.id_buy_cycle |
| id_sell_cycle | prc_mng.ms_sell_cycles.id_sell_cycle |

### Indexes

- **lnk_cr_remittances_pkey:** `CREATE UNIQUE INDEX lnk_cr_remittances_pkey ON prc_mng.lnk_cr_remittances USING btree (id_remittance)`
- **lnk_cr_remittances_id_remittance_pub_key:** `CREATE UNIQUE INDEX lnk_cr_remittances_id_remittance_pub_key ON prc_mng.lnk_cr_remittances USING btree (id_remittance_pub)`
- **lnk_cr_remittances_uuid_request_key:** `CREATE UNIQUE INDEX lnk_cr_remittances_uuid_request_key ON prc_mng.lnk_cr_remittances USING btree (uuid_request)`
- **i_lnk_cr_remittances:** `CREATE INDEX i_lnk_cr_remittances ON prc_mng.lnk_cr_remittances USING btree (id_remittance, id_remittance_pub, date_created, date_closed, to_tranf, tranf, notif_client, origin_deposit_amount, origin_comission, total_origin_amount, total_destiny_amount, mode, id_manual_rate, date_last_modif, urgent, priority)`

---

## prc_mng.lnk_exchange_account_initial_balances {#prcmnglnkexchangeaccountinitialbalances}

**Type:** BASE TABLE
**Row Count:** 0
**Primary Keys:** id_initial_balance

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_initial_balance | bigint(64) | NO | nextval('prc_mng.lnk_exchange_account_initial_balances_id_initial_balance_seq'::regclass) | 64 |
| id_exchange_account_fiat | bigint(64) | NO | NULL | 64 |
| amount | double precision(53) | NO | NULL | 53 |
| id_balance | bigint(64) | NO | NULL | 64 |

### Foreign Keys

| Column | References |
|--------|------------|
| id_exchange_account_fiat | prc_mng.lnk_exchange_accounts_fiat_currencies.id_ex_account_currency |
| id_balance | prc_mng.ms_cycle_balances.id_balance |

### Indexes

- **lnk_exchange_account_initial_balances_pkey:** `CREATE UNIQUE INDEX lnk_exchange_account_initial_balances_pkey ON prc_mng.lnk_exchange_account_initial_balances USING btree (id_initial_balance)`

---

## prc_mng.lnk_exchange_accounts_fiat_currencies {#prcmnglnkexchangeaccountsfiatcurrencies}

**Type:** BASE TABLE
**Row Count:** 33
**Primary Keys:** id_ex_account_currency

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_ex_account_currency | bigint(64) | NO | nextval('prc_mng.lnk_exchange_accounts_fiat_currencie_id_ex_account_currency_seq'::regclass) | 64 |
| id_currency | bigint(64) | NO | NULL | 64 |
| id_exchange_account | bigint(64) | NO | NULL | 64 |
| active | boolean | NO | true | - |

### Foreign Keys

| Column | References |
|--------|------------|
| id_exchange_account | prc_mng.ms_exchange_accounts.id_account |

### Indexes

- **lnk_exchange_accounts_fiat_currencies_pkey:** `CREATE UNIQUE INDEX lnk_exchange_accounts_fiat_currencies_pkey ON prc_mng.lnk_exchange_accounts_fiat_currencies USING btree (id_ex_account_currency)`

---

## prc_mng.lnk_exchange_range_rates {#prcmnglnkexchangerangerates}

**Type:** BASE TABLE
**Row Count:** 57
**Primary Keys:** id_exchange_range_rate

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_exchange_range_rate | bigint(64) | NO | nextval('prc_mng.lnk_exchange_range_rates_id_exchange_range_rate_seq'::regclass) | 64 |
| lower_limit | double precision(53) | NO | NULL | 53 |
| upper_limit | double precision(53) | YES | NULL | 53 |
| id_rate_type | integer(32) | NO | NULL | 32 |
| id_operation_route | integer(32) | YES | NULL | 32 |
| active | boolean | NO | true | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |

### Foreign Keys

| Column | References |
|--------|------------|
| id_operation_route | prc_mng.ms_operation_routes.id_operation_route |

### Indexes

- **lnk_exchange_range_rates_pkey:** `CREATE UNIQUE INDEX lnk_exchange_range_rates_pkey ON prc_mng.lnk_exchange_range_rates USING btree (id_exchange_range_rate)`

---

## prc_mng.lnk_fund_exchange_accounts {#prcmnglnkfundexchangeaccounts}

**Type:** BASE TABLE
**Row Count:** 0
**Primary Keys:** id_fund

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_fund | bigint(64) | NO | nextval('prc_mng.lnk_fund_exchange_accounts_id_fund_seq'::regclass) | 64 |
| date_created | timestamp with time zone | NO | now() | - |
| id_currency | bigint(64) | NO | NULL | 64 |
| id_bank_account | bigint(64) | NO | NULL | 64 |
| id_exchange_account | bigint(64) | NO | NULL | 64 |
| amount | double precision(53) | NO | NULL | 53 |
| uuid_user | uuid | NO | NULL | - |
| fund_exchange | boolean | NO | NULL | - |
| id_cycle_balance | bigint(64) | NO | NULL | 64 |

### Foreign Keys

| Column | References |
|--------|------------|
| id_cycle_balance | prc_mng.ms_cycle_balances.id_balance |
| id_exchange_account | prc_mng.ms_exchange_accounts.id_account |

### Indexes

- **lnk_fund_exchange_accounts_pkey:** `CREATE UNIQUE INDEX lnk_fund_exchange_accounts_pkey ON prc_mng.lnk_fund_exchange_accounts USING btree (id_fund)`

---

## prc_mng.lnk_internal_operations {#prcmnglnkinternaloperations}

**Type:** BASE TABLE
**Row Count:** 0
**Primary Keys:** id_internal_op

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_internal_op | bigint(64) | NO | nextval('prc_mng.lnk_internal_operations_id_internal_op_seq'::regclass) | 64 |
| id_bank_account_origin | bigint(64) | NO | NULL | 64 |
| id_bank_account_destiny | bigint(64) | NO | NULL | 64 |
| amount | double precision(53) | NO | NULL | 53 |
| uuid_user | uuid | NO | NULL | - |
| operation_cod | character varying | NO | NULL | - |
| date_created | timestamp with time zone | NO | now() | - |
| id_cycle_balance | bigint(64) | NO | NULL | 64 |
| file_route | character varying | YES | NULL | - |

### Foreign Keys

| Column | References |
|--------|------------|
| id_cycle_balance | prc_mng.ms_cycle_balances.id_balance |

### Indexes

- **lnk_internal_operations_pkey:** `CREATE UNIQUE INDEX lnk_internal_operations_pkey ON prc_mng.lnk_internal_operations USING btree (id_internal_op)`

---

## prc_mng.lnk_netted_operations {#prcmnglnknettedoperations}

**Type:** BASE TABLE
**Row Count:** 0
**Primary Keys:** id_netted_op

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_netted_op | bigint(64) | NO | nextval('prc_mng.lnk_netted_operations_id_netted_op_seq'::regclass) | 64 |
| id_buy_cycle | bigint(64) | NO | NULL | 64 |
| id_sell_cycle | bigint(64) | NO | NULL | 64 |
| id_bank_account | bigint(64) | NO | NULL | 64 |
| amount | double precision(53) | NO | NULL | 53 |
| uuid_user | uuid | NO | NULL | - |
| operation_cod | character varying | YES | NULL | - |
| btc_amount | double precision(53) | NO | NULL | 53 |
| btc_rate_price | double precision(53) | NO | NULL | 53 |
| date_created | timestamp with time zone | NO | now() | - |

### Foreign Keys

| Column | References |
|--------|------------|
| id_buy_cycle | prc_mng.ms_buy_cycles.id_buy_cycle |
| id_sell_cycle | prc_mng.ms_sell_cycles.id_sell_cycle |

### Indexes

- **lnk_netted_operations_pkey:** `CREATE UNIQUE INDEX lnk_netted_operations_pkey ON prc_mng.lnk_netted_operations USING btree (id_netted_op)`

---

## prc_mng.lnk_pending_transactions {#prcmnglnkpendingtransactions}

**Type:** BASE TABLE
**Row Count:** 0
**Primary Keys:** id_pending_transaction

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_pending_transaction | bigint(64) | NO | nextval('prc_mng.lnk_pending_transactions_id_pending_transaction_seq'::regclass) | 64 |
| amount | double precision(53) | NO | NULL | 53 |
| id_currency | integer(32) | NO | NULL | 32 |
| id_wallet | integer(32) | YES | NULL | 32 |
| email_user | character varying | YES | NULL | - |
| emp_username | character varying | YES | NULL | - |
| id_previous_pending_transaction | integer(32) | YES | NULL | 32 |
| id_balance | integer(32) | YES | NULL | 32 |
| trans_type | character varying | YES | NULL | - |
| trans_date | bigint(64) | YES | NULL | 64 |
| trans_description | text | NO | NULL | - |
| trans_comment | text | YES | NULL | - |
| id_operation | character varying | YES | NULL | - |
| operation_type | character varying | YES | NULL | - |
| confirmation_number | text | YES | NULL | - |
| capture_path | text | YES | NULL | - |
| pending | boolean | NO | true | - |
| manual_transaction | boolean | NO | NULL | - |
| active | boolean | NO | true | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |

### Foreign Keys

| Column | References |
|--------|------------|
| id_previous_pending_transaction | prc_mng.lnk_pending_transactions.id_pending_transaction |

### Indexes

- **lnk_pending_transactions_pkey:** `CREATE UNIQUE INDEX lnk_pending_transactions_pkey ON prc_mng.lnk_pending_transactions USING btree (id_pending_transaction)`

---

## prc_mng.lnk_req_actions_grp_emp {#prcmnglnkreqactionsgrpemp}

**Type:** BASE TABLE
**Row Count:** 44
**Primary Keys:** id_action_emp

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_action_emp | bigint(64) | NO | nextval('prc_mng.lnk_req_actions_grp_emp_id_action_emp_seq'::regclass) | 64 |
| id_action | integer(32) | NO | NULL | 32 |
| id_emp | bigint(64) | NO | NULL | 64 |
| usual_action | boolean | NO | NULL | - |
| bk_action | boolean | NO | NULL | - |
| is_cordinator | boolean | NO | NULL | - |
| allow_venezuela | boolean | NO | NULL | - |
| allow_panama | boolean | NO | NULL | - |
| allow_colombia | boolean | NO | NULL | - |
| allow_peru | boolean | NO | NULL | - |
| allow_chile | boolean | NO | NULL | - |
| allow_argentina | boolean | NO | NULL | - |
| allow_brazil | boolean | NO | NULL | - |
| allow_dominican_rep | boolean | NO | NULL | - |
| allow_mexico | boolean | NO | NULL | - |
| allow_spain | boolean | NO | NULL | - |

### Foreign Keys

| Column | References |
|--------|------------|
| id_action | prc_mng.ms_actions.id_action |

### Indexes

- **lnk_req_actions_grp_emp_pkey:** `CREATE UNIQUE INDEX lnk_req_actions_grp_emp_pkey ON prc_mng.lnk_req_actions_grp_emp USING btree (id_action_emp)`

---

## prc_mng.lnk_residual_operations {#prcmnglnkresidualoperations}

**Type:** BASE TABLE
**Row Count:** 0
**Primary Keys:** id_residual_op

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_residual_op | bigint(64) | NO | nextval('prc_mng.lnk_residual_operations_id_residual_op_seq'::regclass) | 64 |
| id_buy_cycle_origin | bigint(64) | YES | NULL | 64 |
| id_buy_cycle_destiny | bigint(64) | YES | NULL | 64 |
| id_sell_cycle_origin | bigint(64) | YES | NULL | 64 |
| id_sell_cycle_destiny | bigint(64) | YES | NULL | 64 |
| id_fiat_currency | integer(32) | NO | NULL | 32 |
| fiat_amount | double precision(53) | YES | NULL | 53 |
| btc_amount | double precision(53) | NO | NULL | 53 |
| rate_price | double precision(53) | NO | NULL | 53 |
| operation_cod | character varying | NO | NULL | - |
| date_created | timestamp with time zone | NO | now() | - |

### Foreign Keys

| Column | References |
|--------|------------|
| id_buy_cycle_destiny | prc_mng.ms_buy_cycles.id_buy_cycle |
| id_buy_cycle_origin | prc_mng.ms_buy_cycles.id_buy_cycle |
| id_sell_cycle_destiny | prc_mng.ms_sell_cycles.id_sell_cycle |
| id_sell_cycle_origin | prc_mng.ms_sell_cycles.id_sell_cycle |

### Indexes

- **lnk_residual_operations_pkey:** `CREATE UNIQUE INDEX lnk_residual_operations_pkey ON prc_mng.lnk_residual_operations USING btree (id_residual_op)`

---

## prc_mng.lnk_sell_cycle_currencies {#prcmnglnksellcyclecurrencies}

**Type:** BASE TABLE
**Row Count:** 10
**Primary Keys:** id_sell_cycle_currency

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_sell_cycle_currency | bigint(64) | NO | nextval('prc_mng.lnk_sell_cycle_currencies_id_sell_cycle_currency_seq'::regclass) | 64 |
| id_sell_cycle | bigint(64) | NO | NULL | 64 |
| id_currency | bigint(64) | NO | NULL | 64 |

### Foreign Keys

| Column | References |
|--------|------------|
| id_sell_cycle | prc_mng.ms_sell_cycles.id_sell_cycle |

### Indexes

- **lnk_sell_cycle_currencies_pkey:** `CREATE UNIQUE INDEX lnk_sell_cycle_currencies_pkey ON prc_mng.lnk_sell_cycle_currencies USING btree (id_sell_cycle_currency)`

---

## prc_mng.lnk_sell_cycle_operations {#prcmnglnksellcycleoperations}

**Type:** BASE TABLE
**Row Count:** 4
**Primary Keys:** id_sell_operation

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_sell_operation | bigint(64) | NO | nextval('prc_mng.lnk_sell_cycle_operations_id_sell_operation_seq'::regclass) | 64 |
| date_created | timestamp with time zone | NO | now() | - |
| id_sell_cycle | bigint(64) | YES | NULL | 64 |
| id_destiny_currency | bigint(64) | NO | NULL | 64 |
| id_exchange | integer(32) | YES | NULL | 32 |
| id_crypto_currency | bigint(64) | YES | NULL | 64 |
| id_bank_account | bigint(64) | YES | NULL | 64 |
| crypto_amount_used | double precision(53) | NO | NULL | 53 |
| fiat_amount_obtained | double precision(53) | NO | NULL | 53 |
| rate_price | double precision(53) | YES | NULL | 53 |
| operation_cod | character varying | NO | NULL | - |
| uuid_sixmap_user | uuid | NO | NULL | - |
| btc_amount_used | double precision(53) | YES | NULL | 53 |
| btc_rate_price | double precision(53) | YES | NULL | 53 |
| id_exchange_account | bigint(64) | NO | NULL | 64 |
| merchant_type | character varying | YES | NULL | - |
| fee_type | character varying | YES | NULL | - |
| op_ex_number | character varying | YES | NULL | - |
| ex_user | character varying | YES | NULL | - |
| ex_username | character varying | YES | NULL | - |
| id_ex_ident_type | integer(32) | YES | NULL | 32 |
| ex_ident_number | character varying | YES | NULL | - |
| id_ex_bank | integer(32) | YES | NULL | 32 |
| ex_bank_account | character varying | YES | NULL | - |
| ex_bank_account_holder | character varying | YES | NULL | - |
| ex_holder_ident_number_type | character varying | YES | NULL | - |
| ex_holder_ident_number | character varying | YES | NULL | - |
| ex_bank_verif_cod | character varying | YES | NULL | - |
| path_name | character varying | YES | NULL | - |
| btc_close | boolean | NO | true | - |

### Foreign Keys

| Column | References |
|--------|------------|
| id_exchange_account | prc_mng.ms_exchange_accounts.id_account |
| id_sell_cycle | prc_mng.ms_sell_cycles.id_sell_cycle |

### Indexes

- **lnk_sell_cycle_operations_pkey:** `CREATE UNIQUE INDEX lnk_sell_cycle_operations_pkey ON prc_mng.lnk_sell_cycle_operations USING btree (id_sell_operation)`

---

## prc_mng.lnk_third_party_accounts {#prcmnglnkthirdpartyaccounts}

**Type:** BASE TABLE
**Row Count:** 1
**Primary Keys:** id_third_party_account

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_third_party_account | bigint(64) | NO | nextval('prc_mng.lnk_third_party_accounts_id_third_party_account_seq'::regclass) | 64 |
| account_number | character varying | NO | NULL | - |
| id_bank | integer(32) | NO | NULL | 32 |
| id_third_party_user | integer(32) | NO | NULL | 32 |

### Foreign Keys

| Column | References |
|--------|------------|
| id_third_party_user | prc_mng.ms_third_party_users.id_third_party_user |

### Indexes

- **lnk_third_party_accounts_pkey:** `CREATE UNIQUE INDEX lnk_third_party_accounts_pkey ON prc_mng.lnk_third_party_accounts USING btree (id_third_party_account)`

---

## prc_mng.lnk_transfer_result {#prcmnglnktransferresult}

**Type:** BASE TABLE
**Row Count:** 42
**Primary Keys:** id_transfer_result

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_transfer_result | bigint(64) | NO | nextval('prc_mng.lnk_transfer_result_id_transfer_result_seq'::regclass) | 64 |
| ref_number | character varying | YES | NULL | - |
| service_code | character varying | NO | NULL | - |
| date_result | timestamp with time zone | NO | now() | - |
| id_beneficiary | bigint(64) | NO | NULL | 64 |
| id_pay_method | bigint(64) | NO | NULL | 64 |
| id_payment_service | integer(32) | NO | NULL | 32 |
| id_result_type | integer(32) | NO | NULL | 32 |
| reason | text | YES | NULL | - |

### Foreign Keys

| Column | References |
|--------|------------|
| id_beneficiary | prc_mng.ms_cr_beneficiaries.id_beneficiary |
| id_payment_service | prc_mng.ms_payment_service.id_payment_service |
| id_result_type | prc_mng.ms_result_type.id_result_type |

### Indexes

- **lnk_transfer_result_pkey:** `CREATE UNIQUE INDEX lnk_transfer_result_pkey ON prc_mng.lnk_transfer_result USING btree (id_transfer_result)`

---

## prc_mng.lnk_user_consult {#prcmnglnkuserconsult}

**Type:** BASE TABLE
**Row Count:** 1
**Primary Keys:** id_consult

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_consult | bigint(64) | NO | nextval('prc_mng.lnk_user_consult_id_consult_seq'::regclass) | 64 |
| id_chat | bigint(64) | NO | NULL | 64 |
| id_whatsapp_msg_init | bigint(64) | NO | NULL | 64 |
| id_whatsapp_msg_close | bigint(64) | YES | NULL | 64 |
| date_created | timestamp with time zone | NO | now() | - |
| date_close | timestamp with time zone | YES | NULL | - |
| consult_open | boolean | NO | true | - |
| id_consult_type | integer(32) | YES | NULL | 32 |
| uuid_sixmap_user_close | uuid | YES | NULL | - |

### Foreign Keys

| Column | References |
|--------|------------|
| id_consult_type | prc_mng.ms_user_consult_types.id_user_consult_type |

### Indexes

- **lnk_user_consult_pkey:** `CREATE UNIQUE INDEX lnk_user_consult_pkey ON prc_mng.lnk_user_consult USING btree (id_consult)`

---

## prc_mng.ms_actions {#prcmngmsactions}

**Type:** BASE TABLE
**Row Count:** 6
**Primary Keys:** id_action

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_action | integer(32) | NO | nextval('prc_mng.ms_actions_id_action_seq'::regclass) | 32 |
| name | character varying(30) | NO | NULL | 30 |
| process_type | character varying(15) | NO | NULL | 15 |
| department_asing | character varying(15) | NO | NULL | 15 |
| display_name | character varying | YES | NULL | - |

### Indexes

- **ms_actions_pkey:** `CREATE UNIQUE INDEX ms_actions_pkey ON prc_mng.ms_actions USING btree (id_action)`

---

## prc_mng.ms_buy_cycles {#prcmngmsbuycycles}

**Type:** BASE TABLE
**Row Count:** 1
**Primary Keys:** id_buy_cycle

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_buy_cycle | bigint(64) | NO | nextval('prc_mng.ms_buy_cycles_id_buy_cycle_seq'::regclass) | 64 |
| name_cycle | character varying(50) | NO | NULL | 50 |
| date_created | timestamp with time zone | NO | now() | - |
| date_closed | timestamp with time zone | YES | NULL | - |
| id_balance | bigint(64) | NO | NULL | 64 |

### Foreign Keys

| Column | References |
|--------|------------|
| id_balance | prc_mng.ms_cycle_balances.id_balance |

### Indexes

- **ms_buy_cycles_pkey:** `CREATE UNIQUE INDEX ms_buy_cycles_pkey ON prc_mng.ms_buy_cycles USING btree (id_buy_cycle)`

---

## prc_mng.ms_cr_beneficiaries {#prcmngmscrbeneficiaries}

**Type:** BASE TABLE
**Row Count:** 265
**Primary Keys:** id_beneficiary

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_beneficiary | bigint(64) | NO | nextval('prc_mng.ms_cr_beneficiaries_id_beneficiary_seq'::regclass) | 64 |
| owner_name | character varying(50) | YES | NULL | 50 |
| identification | character varying(50) | YES | NULL | 50 |
| account | character varying(50) | YES | NULL | 50 |
| account_type | character varying(50) | YES | NULL | 50 |
| phone_number | character varying(50) | YES | NULL | 50 |
| email | character varying(50) | YES | NULL | 50 |
| active | boolean | NO | true | - |
| partial_amount | double precision(53) | YES | NULL | 53 |
| partial_local_amount | double precision(53) | YES | NULL | 53 |
| id_remittance | integer(32) | NO | NULL | 32 |
| bank_deposit_made | boolean | NO | false | - |
| id_destiny_bank | integer(32) | YES | NULL | 32 |
| id_pay_method | integer(32) | YES | NULL | 32 |
| id_notification_type | integer(32) | YES | NULL | 32 |
| email_notif | character varying(100) | YES | NULL | 100 |
| phone_notif | character varying(30) | YES | NULL | 30 |
| id_frequent_beneficiary | bigint(64) | YES | NULL | 64 |
| id_optional_field | bigint(64) | YES | NULL | 64 |
| id_bank_account | integer(32) | YES | NULL | 32 |
| id_doc_type | integer(32) | NO | NULL | 32 |
| path_name | character varying | YES | NULL | - |
| tranf_ref_number | character varying | YES | NULL | - |
| modif_version | integer(32) | NO | 1 | 32 |
| relation_type | character varying | YES | NULL | - |
| city_notif | character varying | YES | NULL | - |
| address_notif | character varying | YES | NULL | - |
| date_created | timestamp with time zone | YES | now() | - |
| date_closed | timestamp with time zone | YES | NULL | - |
| transfer_successful | boolean | YES | NULL | - |
| id_transfer_bank | integer(32) | YES | NULL | 32 |
| uuid_sixmap_user | uuid | YES | NULL | - |
| comment | text | YES | NULL | - |
| failed_payment_service | boolean | NO | false | - |
| add_transfer_to_auto_payment | boolean | NO | false | - |

### Foreign Keys

| Column | References |
|--------|------------|
| id_frequent_beneficiary | prc_mng.ms_cr_frequents_beneficiaries.id_beneficiary |
| id_frequent_beneficiary | prc_mng.ms_cr_frequents_beneficiaries.id_beneficiary |
| id_frequent_beneficiary | prc_mng.ms_cr_frequents_beneficiaries.id_beneficiary |
| id_frequent_beneficiary | prc_mng.ms_cr_frequents_beneficiaries.id_beneficiary |
| id_frequent_beneficiary | prc_mng.ms_cr_frequents_beneficiaries.id_beneficiary |
| id_frequent_beneficiary | prc_mng.ms_cr_frequents_beneficiaries.id_beneficiary |
| id_frequent_beneficiary | prc_mng.ms_cr_frequents_beneficiaries.id_beneficiary |
| id_remittance | prc_mng.lnk_cr_remittances.id_remittance |

### Indexes

- **ms_cr_beneficiaries_pkey:** `CREATE UNIQUE INDEX ms_cr_beneficiaries_pkey ON prc_mng.ms_cr_beneficiaries USING btree (id_beneficiary)`

---

## prc_mng.ms_cr_claims {#prcmngmscrclaims}

**Type:** BASE TABLE
**Row Count:** 0
**Primary Keys:** id_claim

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_claim | bigint(64) | NO | nextval('prc_mng.ms_cr_claims_id_claim_seq'::regclass) | 64 |
| created_date | timestamp with time zone | NO | now() | - |
| modification_date | timestamp with time zone | YES | NULL | - |
| description | character varying(250) | NO | NULL | 250 |
| id_remittance | integer(32) | NO | NULL | 32 |

### Foreign Keys

| Column | References |
|--------|------------|
| id_remittance | prc_mng.lnk_cr_remittances.id_remittance |

### Indexes

- **ms_cr_claims_pkey:** `CREATE UNIQUE INDEX ms_cr_claims_pkey ON prc_mng.ms_cr_claims USING btree (id_claim)`

---

## prc_mng.ms_cr_frequents_beneficiaries {#prcmngmscrfrequentsbeneficiaries}

**Type:** BASE TABLE
**Row Count:** 32
**Primary Keys:** id_beneficiary

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_beneficiary | bigint(64) | NO | nextval('prc_mng.ms_cr_frequents_beneficiaries_id_beneficiary_seq'::regclass) | 64 |
| nickname | character varying(50) | NO | NULL | 50 |
| owner_name | character varying(50) | NO | NULL | 50 |
| identification | character varying(50) | NO | NULL | 50 |
| account | character varying(50) | YES | NULL | 50 |
| account_type | character varying(50) | YES | NULL | 50 |
| phone_number | character varying(50) | YES | NULL | 50 |
| email | character varying(50) | YES | NULL | 50 |
| id_doc_type | integer(32) | NO | NULL | 32 |
| active | boolean | NO | true | - |
| id_bank | integer(32) | YES | NULL | 32 |
| uuid_user_cust | uuid | NO | NULL | - |
| id_pay_method | integer(32) | NO | NULL | 32 |
| id_optional_field | bigint(64) | YES | NULL | 64 |
| relation_type | character varying | YES | NULL | - |
| email_notif | character varying | YES | NULL | - |
| phone_notif | character varying | YES | NULL | - |
| address_notif | character varying | YES | NULL | - |
| city_notif | character varying | YES | NULL | - |
| id_notification_type | integer(32) | YES | NULL | 32 |

### Indexes

- **ms_cr_frequents_beneficiaries_pkey:** `CREATE UNIQUE INDEX ms_cr_frequents_beneficiaries_pkey ON prc_mng.ms_cr_frequents_beneficiaries USING btree (id_beneficiary)`

---

## prc_mng.ms_cr_origin_transactions {#prcmngmscrorigintransactions}

**Type:** BASE TABLE
**Row Count:** 134
**Primary Keys:** id_transaction

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_transaction | bigint(64) | NO | nextval('prc_mng.ms_cr_origin_transactions_id_transaction_seq'::regclass) | 64 |
| created_date | timestamp with time zone | NO | now() | - |
| modification_date | timestamp with time zone | YES | NULL | - |
| path_name | text | NO | NULL | - |
| verif_number | character varying | YES | NULL | - |
| confirmation_number | character varying | YES | NULL | - |
| id_remittance | integer(32) | YES | NULL | 32 |
| id_exchange | integer(32) | YES | NULL | 32 |
| bank_verification | boolean | YES | NULL | - |
| is_third_party_transfer | boolean | YES | NULL | - |
| third_party_name | character varying | YES | NULL | - |
| third_party_last_name | character varying | YES | NULL | - |
| third_party_doc | character varying | YES | NULL | - |
| third_party_account_number | character varying | YES | NULL | - |
| third_party_id_bank | bigint(64) | YES | NULL | 64 |
| third_party_id_origin_country | bigint(64) | YES | NULL | 64 |
| third_party_id_origin_currency | bigint(64) | YES | NULL | 64 |
| third_party_path_name_doc | text | YES | NULL | - |
| third_party_path_name_bank_doc | text | YES | NULL | - |
| active | boolean | NO | true | - |
| amount | double precision(53) | NO | NULL | 53 |
| id_transaction_type | integer(32) | YES | NULL | 32 |
| id_bank_account | integer(32) | YES | NULL | 32 |
| transfer_name | character varying | YES | NULL | - |
| date_received | date | YES | NULL | - |
| comp_number | character varying | YES | NULL | - |
| uuid_sixmap_user | uuid | YES | NULL | - |
| comment | text | YES | NULL | - |
| bank_code_duplicated | boolean | NO | false | - |
| client_code_duplicated | boolean | NO | false | - |
| id_third_party_account | integer(32) | YES | NULL | 32 |

### Foreign Keys

| Column | References |
|--------|------------|
| id_exchange | prc_mng.lnk_cr_exchanges.id_exchange |
| id_remittance | prc_mng.lnk_cr_remittances.id_remittance |
| id_third_party_account | prc_mng.lnk_third_party_accounts.id_third_party_account |
| id_transaction_type | prc_mng.ms_origin_transaction_types.id_transaction_type |

### Indexes

- **ms_cr_origin_transactions_pkey:** `CREATE UNIQUE INDEX ms_cr_origin_transactions_pkey ON prc_mng.ms_cr_origin_transactions USING btree (id_transaction)`

---

## prc_mng.ms_crypto_fees {#prcmngmscryptofees}

**Type:** BASE TABLE
**Row Count:** 4
**Primary Keys:** id_crypto_fee

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_crypto_fee | bigint(64) | NO | nextval('prc_mng.ms_crypto_fees_id_crypto_fee_seq'::regclass) | 64 |
| fee | double precision(53) | YES | NULL | 53 |
| id_operation_route | integer(32) | YES | NULL | 32 |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |
| active | boolean | NO | true | - |

### Foreign Keys

| Column | References |
|--------|------------|
| id_operation_route | prc_mng.ms_operation_routes.id_operation_route |

### Indexes

- **ms_crypto_fees_pkey:** `CREATE UNIQUE INDEX ms_crypto_fees_pkey ON prc_mng.ms_crypto_fees USING btree (id_crypto_fee)`

---

## prc_mng.ms_cycle_balances {#prcmngmscyclebalances}

**Type:** BASE TABLE
**Row Count:** 1
**Primary Keys:** id_balance

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_balance | bigint(64) | NO | nextval('prc_mng.ms_cycle_balances_id_balance_seq'::regclass) | 64 |
| date_balance | date | NO | (now())::date | - |
| current_active | boolean | NO | true | - |

### Indexes

- **ms_cycle_balances_pkey:** `CREATE UNIQUE INDEX ms_cycle_balances_pkey ON prc_mng.ms_cycle_balances USING btree (id_balance)`

---

## prc_mng.ms_destiny_fee_commission_percentages {#prcmngmsdestinyfeecommissionpercentages}

**Type:** BASE TABLE
**Row Count:** 8
**Primary Keys:** id_percentage

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_percentage | integer(32) | NO | nextval('prc_mng.ms_destiny_fee_commission_percentages_id_percentage_seq'::regclass) | 32 |
| percentage_fee | double precision(53) | NO | NULL | 53 |
| id_destiny_currency | integer(32) | NO | NULL | 32 |

### Indexes

- **ms_destiny_fee_commission_percentages_pkey:** `CREATE UNIQUE INDEX ms_destiny_fee_commission_percentages_pkey ON prc_mng.ms_destiny_fee_commission_percentages USING btree (id_percentage)`
- **ms_destiny_fee_commission_percentages_id_destiny_currency_key:** `CREATE UNIQUE INDEX ms_destiny_fee_commission_percentages_id_destiny_currency_key ON prc_mng.ms_destiny_fee_commission_percentages USING btree (id_destiny_currency)`

---

## prc_mng.ms_exchange_accounts {#prcmngmsexchangeaccounts}

**Type:** BASE TABLE
**Row Count:** 8
**Primary Keys:** id_account

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_account | bigint(64) | NO | nextval('prc_mng.ms_exchange_accounts_id_account_seq'::regclass) | 64 |
| username | character varying | NO | NULL | - |
| user_cod | character varying | YES | NULL | - |
| id_exchange | bigint(64) | NO | NULL | 64 |
| active | boolean | NO | true | - |

### Indexes

- **ms_exchange_accounts_pkey:** `CREATE UNIQUE INDEX ms_exchange_accounts_pkey ON prc_mng.ms_exchange_accounts USING btree (id_account)`

---

## prc_mng.ms_exchange_address {#prcmngmsexchangeaddress}

**Type:** BASE TABLE
**Row Count:** 19
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_exchange_address | bigint(64) | NO | nextval('prc_mng.ms_exchange_address_id_exchange_address_seq'::regclass) | 64 |
| name | text | NO | NULL | - |
| iso_code | character varying | YES | NULL | - |
| id_country | integer(32) | YES | NULL | 32 |
| id_platform | integer(32) | YES | NULL | 32 |
| active | boolean | NO | true | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |

### Indexes

- **ms_exchange_address_id_exchange_address_key:** `CREATE UNIQUE INDEX ms_exchange_address_id_exchange_address_key ON prc_mng.ms_exchange_address USING btree (id_exchange_address)`

---

## prc_mng.ms_exchange_atc_revision_status {#prcmngmsexchangeatcrevisionstatus}

**Type:** BASE TABLE
**Row Count:** 3
**Primary Keys:** id_rev_status

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_rev_status | integer(32) | NO | nextval('prc_mng.ms_exchange_atc_revision_status_id_rev_status_seq'::regclass) | 32 |
| name | character varying(20) | NO | NULL | 20 |

### Indexes

- **ms_exchange_atc_revision_status_pkey:** `CREATE UNIQUE INDEX ms_exchange_atc_revision_status_pkey ON prc_mng.ms_exchange_atc_revision_status USING btree (id_rev_status)`

---

## prc_mng.ms_exchange_award_status {#prcmngmsexchangeawardstatus}

**Type:** BASE TABLE
**Row Count:** 7
**Primary Keys:** id_award_status

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_award_status | integer(32) | NO | nextval('prc_mng.ms_exchange_award_status_id_award_status_seq'::regclass) | 32 |
| name | character varying(20) | NO | NULL | 20 |

### Indexes

- **ms_exchange_award_status_pkey:** `CREATE UNIQUE INDEX ms_exchange_award_status_pkey ON prc_mng.ms_exchange_award_status USING btree (id_award_status)`

---

## prc_mng.ms_exchange_bank_verif_status {#prcmngmsexchangebankverifstatus}

**Type:** BASE TABLE
**Row Count:** 4
**Primary Keys:** id_bank_verif_status

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_bank_verif_status | integer(32) | NO | nextval('prc_mng.ms_exchange_bank_verif_status_id_bank_verif_status_seq'::regclass) | 32 |
| name | character varying(20) | NO | NULL | 20 |

### Indexes

- **ms_exchange_bank_verif_status_pkey:** `CREATE UNIQUE INDEX ms_exchange_bank_verif_status_pkey ON prc_mng.ms_exchange_bank_verif_status USING btree (id_bank_verif_status)`

---

## prc_mng.ms_exchange_buy_cycle_status {#prcmngmsexchangebuycyclestatus}

**Type:** BASE TABLE
**Row Count:** 3
**Primary Keys:** id_buy_cycle_status

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_buy_cycle_status | integer(32) | NO | nextval('prc_mng.ms_exchange_buy_cycle_status_id_buy_cycle_status_seq'::regclass) | 32 |
| name | character varying(20) | NO | NULL | 20 |

### Indexes

- **ms_exchange_buy_cycle_status_pkey:** `CREATE UNIQUE INDEX ms_exchange_buy_cycle_status_pkey ON prc_mng.ms_exchange_buy_cycle_status USING btree (id_buy_cycle_status)`

---

## prc_mng.ms_exchange_claim_status {#prcmngmsexchangeclaimstatus}

**Type:** BASE TABLE
**Row Count:** 2
**Primary Keys:** id_claim_status

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_claim_status | integer(32) | NO | nextval('prc_mng.ms_exchange_claim_status_id_claim_status_seq'::regclass) | 32 |
| name | character varying(20) | NO | NULL | 20 |

### Indexes

- **ms_exchange_claim_status_pkey:** `CREATE UNIQUE INDEX ms_exchange_claim_status_pkey ON prc_mng.ms_exchange_claim_status USING btree (id_claim_status)`

---

## prc_mng.ms_exchange_modified_status {#prcmngmsexchangemodifiedstatus}

**Type:** BASE TABLE
**Row Count:** 2
**Primary Keys:** id_modified_status

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_modified_status | integer(32) | NO | nextval('prc_mng.ms_exchange_modified_status_id_modified_status_seq'::regclass) | 32 |
| name | character varying(20) | NO | NULL | 20 |

### Indexes

- **ms_exchange_modified_status_pkey:** `CREATE UNIQUE INDEX ms_exchange_modified_status_pkey ON prc_mng.ms_exchange_modified_status USING btree (id_modified_status)`

---

## prc_mng.ms_exchange_notif_client_status {#prcmngmsexchangenotifclientstatus}

**Type:** BASE TABLE
**Row Count:** 2
**Primary Keys:** id_notif_client_status

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_notif_client_status | integer(32) | NO | nextval('prc_mng.ms_exchange_notif_client_status_id_notif_client_status_seq'::regclass) | 32 |
| name | character varying(20) | NO | NULL | 20 |

### Indexes

- **ms_exchange_notif_client_status_pkey:** `CREATE UNIQUE INDEX ms_exchange_notif_client_status_pkey ON prc_mng.ms_exchange_notif_client_status USING btree (id_notif_client_status)`

---

## prc_mng.ms_exchange_ok_award_status {#prcmngmsexchangeokawardstatus}

**Type:** BASE TABLE
**Row Count:** 2
**Primary Keys:** id_ok_award_status

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_ok_award_status | integer(32) | NO | nextval('prc_mng.ms_exchange_ok_award_status_id_ok_award_status_seq'::regclass) | 32 |
| name | character varying(20) | NO | NULL | 20 |

### Indexes

- **ms_exchange_ok_award_status_pkey:** `CREATE UNIQUE INDEX ms_exchange_ok_award_status_pkey ON prc_mng.ms_exchange_ok_award_status USING btree (id_ok_award_status)`

---

## prc_mng.ms_exchange_ok_transf_status {#prcmngmsexchangeoktransfstatus}

**Type:** BASE TABLE
**Row Count:** 3
**Primary Keys:** id_ok_transf_status

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_ok_transf_status | integer(32) | NO | nextval('prc_mng.ms_exchange_ok_transf_status_id_ok_transf_status_seq'::regclass) | 32 |
| name | character varying(20) | NO | NULL | 20 |

### Indexes

- **ms_exchange_ok_transf_status_pkey:** `CREATE UNIQUE INDEX ms_exchange_ok_transf_status_pkey ON prc_mng.ms_exchange_ok_transf_status USING btree (id_ok_transf_status)`

---

## prc_mng.ms_exchange_pause_status {#prcmngmsexchangepausestatus}

**Type:** BASE TABLE
**Row Count:** 4
**Primary Keys:** id_pause_status

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_pause_status | integer(32) | NO | nextval('prc_mng.ms_exchange_pause_status_id_pause_status_seq'::regclass) | 32 |
| name | character varying(20) | NO | NULL | 20 |

### Indexes

- **ms_exchange_pause_status_pkey:** `CREATE UNIQUE INDEX ms_exchange_pause_status_pkey ON prc_mng.ms_exchange_pause_status USING btree (id_pause_status)`

---

## prc_mng.ms_exchange_principal_status {#prcmngmsexchangeprincipalstatus}

**Type:** BASE TABLE
**Row Count:** 9
**Primary Keys:** id_ppl_status

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_ppl_status | integer(32) | NO | nextval('prc_mng.ms_exchange_principal_status_id_ppl_status_seq'::regclass) | 32 |
| name | character varying(20) | NO | NULL | 20 |

### Indexes

- **ms_exchange_principal_status_pkey:** `CREATE UNIQUE INDEX ms_exchange_principal_status_pkey ON prc_mng.ms_exchange_principal_status USING btree (id_ppl_status)`

---

## prc_mng.ms_exchange_public_status {#prcmngmsexchangepublicstatus}

**Type:** BASE TABLE
**Row Count:** 4
**Primary Keys:** id_pub_status

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_pub_status | integer(32) | NO | nextval('prc_mng.ms_exchange_public_status_id_pub_status_seq'::regclass) | 32 |
| name | character varying(20) | NO | NULL | 20 |

### Indexes

- **ms_exchange_public_status_pkey:** `CREATE UNIQUE INDEX ms_exchange_public_status_pkey ON prc_mng.ms_exchange_public_status USING btree (id_pub_status)`

---

## prc_mng.ms_exchange_rates {#prcmngmsexchangerates}

**Type:** BASE TABLE
**Row Count:** 57
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_exchange_rate | bigint(64) | NO | nextval('prc_mng.ms_exchange_rates_id_exchange_rate_seq'::regclass) | 64 |
| id_operation_route | integer(32) | NO | NULL | 32 |
| id_rate_type | integer(32) | NO | NULL | 32 |
| rate_factor | double precision(53) | NO | NULL | 53 |
| profit_margin | double precision(53) | YES | NULL | 53 |
| active | boolean | NO | true | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |

### Foreign Keys

| Column | References |
|--------|------------|
| id_operation_route | prc_mng.ms_operation_routes.id_operation_route |

### Indexes

- **ms_exchange_rates_id_exchange_rate_key:** `CREATE UNIQUE INDEX ms_exchange_rates_id_exchange_rate_key ON prc_mng.ms_exchange_rates USING btree (id_exchange_rate)`

---

## prc_mng.ms_exchange_sell_cycle_status {#prcmngmsexchangesellcyclestatus}

**Type:** BASE TABLE
**Row Count:** 3
**Primary Keys:** id_sell_cycle_status

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_sell_cycle_status | integer(32) | NO | nextval('prc_mng.ms_exchange_sell_cycle_status_id_sell_cycle_status_seq'::regclass) | 32 |
| name | character varying(20) | NO | NULL | 20 |

### Indexes

- **ms_exchange_sell_cycle_status_pkey:** `CREATE UNIQUE INDEX ms_exchange_sell_cycle_status_pkey ON prc_mng.ms_exchange_sell_cycle_status USING btree (id_sell_cycle_status)`

---

## prc_mng.ms_exchange_transf_status {#prcmngmsexchangetransfstatus}

**Type:** BASE TABLE
**Row Count:** 3
**Primary Keys:** id_transf_status

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_transf_status | integer(32) | NO | nextval('prc_mng.ms_exchange_transf_status_id_transf_status_seq'::regclass) | 32 |
| name | character varying(20) | NO | NULL | 20 |

### Indexes

- **ms_exchange_transf_status_pkey:** `CREATE UNIQUE INDEX ms_exchange_transf_status_pkey ON prc_mng.ms_exchange_transf_status USING btree (id_transf_status)`

---

## prc_mng.ms_exchange_types {#prcmngmsexchangetypes}

**Type:** BASE TABLE
**Row Count:** 5
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_exchange_type | bigint(64) | NO | nextval('prc_mng.ms_exchange_types_id_exchange_type_seq'::regclass) | 64 |
| name | text | NO | NULL | - |
| active | boolean | NO | true | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |

### Indexes

- **ms_exchange_types_id_exchange_type_key:** `CREATE UNIQUE INDEX ms_exchange_types_id_exchange_type_key ON prc_mng.ms_exchange_types USING btree (id_exchange_type)`

---

## prc_mng.ms_log_action_com {#prcmngmslogactioncom}

**Type:** BASE TABLE
**Row Count:** 134
**Primary Keys:** id_log_action

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_log_action | integer(32) | NO | nextval('prc_mng.ms_log_action_com_id_log_action_seq'::regclass) | 32 |
| log_action_date | timestamp with time zone | NO | now() | - |
| action_value | character varying(45) | NO | NULL | 45 |
| action_comment | character varying(100) | YES | NULL | 100 |
| active | boolean | NO | true | - |
| id_uuid_user | uuid | YES | NULL | - |
| id_remittance | bigint(64) | YES | NULL | 64 |
| id_exchange | bigint(64) | YES | NULL | 64 |
| id_action | integer(32) | NO | NULL | 32 |
| id_department | integer(32) | YES | NULL | 32 |
| alert | boolean | YES | false | - |

### Foreign Keys

| Column | References |
|--------|------------|
| id_action | prc_mng.ms_remittance_log_actions.id_action |
| id_exchange | prc_mng.lnk_cr_exchanges.id_exchange |
| id_remittance | prc_mng.lnk_cr_remittances.id_remittance |

### Indexes

- **ms_log_action_com_pkey:** `CREATE UNIQUE INDEX ms_log_action_com_pkey ON prc_mng.ms_log_action_com USING btree (id_log_action)`

---

## prc_mng.ms_networks {#prcmngmsnetworks}

**Type:** BASE TABLE
**Row Count:** 2
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_network | bigint(64) | NO | nextval('prc_mng.ms_networks_id_network_seq'::regclass) | 64 |
| token | text | YES | NULL | - |
| name | text | NO | NULL | - |
| id_currency | integer(32) | YES | NULL | 32 |
| active | boolean | NO | true | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |

### Indexes

- **ms_networks_id_network_key:** `CREATE UNIQUE INDEX ms_networks_id_network_key ON prc_mng.ms_networks USING btree (id_network)`

---

## prc_mng.ms_operation_routes {#prcmngmsoperationroutes}

**Type:** BASE TABLE
**Row Count:** 85
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_operation_route | bigint(64) | NO | nextval('prc_mng.ms_operation_routes_id_operation_route_seq'::regclass) | 64 |
| id_origin_address | integer(32) | NO | NULL | 32 |
| id_destiny_address | integer(32) | NO | NULL | 32 |
| id_origin_currency | integer(32) | NO | NULL | 32 |
| id_destiny_currency | integer(32) | NO | NULL | 32 |
| cost_factor | double precision(53) | YES | NULL | 53 |
| profit_margin | double precision(53) | YES | 5 | 53 |
| percent_limit | double precision(53) | YES | 0.25 | 53 |
| date_cost_modif | timestamp with time zone | YES | NULL | - |
| operation | character varying | YES | NULL | - |
| active | boolean | NO | true | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |

### Foreign Keys

| Column | References |
|--------|------------|
| id_destiny_address | prc_mng.ms_exchange_address.id_exchange_address |
| id_origin_address | prc_mng.ms_exchange_address.id_exchange_address |

### Indexes

- **ms_operation_routes_id_operation_route_key:** `CREATE UNIQUE INDEX ms_operation_routes_id_operation_route_key ON prc_mng.ms_operation_routes USING btree (id_operation_route)`

---

## prc_mng.ms_origin_fee_commission_percentages {#prcmngmsoriginfeecommissionpercentages}

**Type:** BASE TABLE
**Row Count:** 8
**Primary Keys:** id_percentage

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_percentage | integer(32) | NO | nextval('prc_mng.ms_origin_fee_commission_percentages_id_percentage_seq'::regclass) | 32 |
| normal_fee | double precision(53) | NO | NULL | 53 |
| preferential_fee | double precision(53) | NO | NULL | 53 |
| mayor_fee | double precision(53) | NO | NULL | 53 |
| id_origin_currency | integer(32) | NO | NULL | 32 |

### Indexes

- **ms_origin_fee_commission_percentages_pkey:** `CREATE UNIQUE INDEX ms_origin_fee_commission_percentages_pkey ON prc_mng.ms_origin_fee_commission_percentages USING btree (id_percentage)`
- **ms_origin_fee_commission_percentages_id_origin_currency_key:** `CREATE UNIQUE INDEX ms_origin_fee_commission_percentages_id_origin_currency_key ON prc_mng.ms_origin_fee_commission_percentages USING btree (id_origin_currency)`

---

## prc_mng.ms_origin_transaction_types {#prcmngmsorigintransactiontypes}

**Type:** BASE TABLE
**Row Count:** 3
**Primary Keys:** id_transaction_type

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_transaction_type | integer(32) | NO | nextval('prc_mng.ms_origin_transaction_types_id_transaction_type_seq'::regclass) | 32 |
| name | character varying | YES | NULL | - |

### Indexes

- **ms_origin_transaction_types_pkey:** `CREATE UNIQUE INDEX ms_origin_transaction_types_pkey ON prc_mng.ms_origin_transaction_types USING btree (id_transaction_type)`

---

## prc_mng.ms_payment_service {#prcmngmspaymentservice}

**Type:** BASE TABLE
**Row Count:** 1
**Primary Keys:** id_payment_service

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_payment_service | integer(32) | NO | nextval('prc_mng.ms_payment_service_id_payment_service_seq'::regclass) | 32 |
| name_service | character varying | NO | NULL | - |

### Indexes

- **ms_payment_service_pkey:** `CREATE UNIQUE INDEX ms_payment_service_pkey ON prc_mng.ms_payment_service USING btree (id_payment_service)`

---

## prc_mng.ms_pre_exchange {#prcmngmspreexchange}

**Type:** BASE TABLE
**Row Count:** 0
**Primary Keys:** id_pre_exchange

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_pre_exchange | bigint(64) | NO | nextval('prc_mng.ms_pre_exchange_id_pre_exchange_seq'::regclass) | 64 |
| pre_exchange | json | YES | NULL | - |
| email_user | character varying | YES | NULL | - |
| was_expired | boolean | YES | NULL | - |
| date_last_shown | bigint(64) | YES | NULL | 64 |
| active | boolean | NO | true | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |

### Indexes

- **ms_pre_exchange_pkey:** `CREATE UNIQUE INDEX ms_pre_exchange_pkey ON prc_mng.ms_pre_exchange USING btree (id_pre_exchange)`

---

## prc_mng.ms_remittance_bank_verif_status {#prcmngmsremittancebankverifstatus}

**Type:** BASE TABLE
**Row Count:** 3
**Primary Keys:** id_ver_status

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_ver_status | integer(32) | NO | nextval('prc_mng.ms_remittance_bank_verif_status_id_ver_status_seq'::regclass) | 32 |
| name | character varying(20) | NO | NULL | 20 |

### Indexes

- **ms_remittance_bank_verif_status_pkey:** `CREATE UNIQUE INDEX ms_remittance_bank_verif_status_pkey ON prc_mng.ms_remittance_bank_verif_status USING btree (id_ver_status)`

---

## prc_mng.ms_remittance_buy_cycle_status {#prcmngmsremittancebuycyclestatus}

**Type:** BASE TABLE
**Row Count:** 2
**Primary Keys:** id_buy_cycle_status

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_buy_cycle_status | integer(32) | NO | nextval('prc_mng.ms_remittance_buy_cycle_status_id_buy_cycle_status_seq'::regclass) | 32 |
| name | character varying(20) | NO | NULL | 20 |

### Indexes

- **ms_remittance_buy_cycle_status_pkey:** `CREATE UNIQUE INDEX ms_remittance_buy_cycle_status_pkey ON prc_mng.ms_remittance_buy_cycle_status USING btree (id_buy_cycle_status)`

---

## prc_mng.ms_remittance_claim_status {#prcmngmsremittanceclaimstatus}

**Type:** BASE TABLE
**Row Count:** 2
**Primary Keys:** id_claim_status

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_claim_status | integer(32) | NO | nextval('prc_mng.ms_remittance_claim_status_id_claim_status_seq'::regclass) | 32 |
| name | character varying(20) | NO | NULL | 20 |

### Indexes

- **ms_remittance_claim_status_pkey:** `CREATE UNIQUE INDEX ms_remittance_claim_status_pkey ON prc_mng.ms_remittance_claim_status USING btree (id_claim_status)`

---

## prc_mng.ms_remittance_comments {#prcmngmsremittancecomments}

**Type:** BASE TABLE
**Row Count:** 0
**Primary Keys:** id_comment

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_comment | bigint(64) | NO | nextval('prc_mng.ms_remittance_comments_id_comment_seq'::regclass) | 64 |
| id_emp | bigint(64) | NO | NULL | 64 |
| content | text | NO | NULL | - |
| id_remittance | integer(32) | NO | NULL | 32 |

### Foreign Keys

| Column | References |
|--------|------------|
| id_remittance | prc_mng.lnk_cr_remittances.id_remittance |

### Indexes

- **ms_remittance_comments_pkey:** `CREATE UNIQUE INDEX ms_remittance_comments_pkey ON prc_mng.ms_remittance_comments USING btree (id_comment)`

---

## prc_mng.ms_remittance_log_actions {#prcmngmsremittancelogactions}

**Type:** BASE TABLE
**Row Count:** 36
**Primary Keys:** id_action

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_action | integer(32) | NO | nextval('prc_mng.ms_remittance_log_actions_id_action_seq'::regclass) | 32 |
| name | character varying | NO | NULL | - |

### Indexes

- **ms_remittance_log_actions_pkey:** `CREATE UNIQUE INDEX ms_remittance_log_actions_pkey ON prc_mng.ms_remittance_log_actions USING btree (id_action)`

---

## prc_mng.ms_remittance_notif_benef_status {#prcmngmsremittancenotifbenefstatus}

**Type:** BASE TABLE
**Row Count:** 3
**Primary Keys:** id_notif_status

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_notif_status | integer(32) | NO | nextval('prc_mng.ms_remittance_notif_benef_status_id_notif_status_seq'::regclass) | 32 |
| name | character varying(20) | NO | NULL | 20 |

### Indexes

- **ms_remittance_notif_benef_status_pkey:** `CREATE UNIQUE INDEX ms_remittance_notif_benef_status_pkey ON prc_mng.ms_remittance_notif_benef_status USING btree (id_notif_status)`

---

## prc_mng.ms_remittance_pause_status {#prcmngmsremittancepausestatus}

**Type:** BASE TABLE
**Row Count:** 4
**Primary Keys:** id_pas_status

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_pas_status | integer(32) | NO | nextval('prc_mng.ms_remittance_pause_status_id_pas_status_seq'::regclass) | 32 |
| name | character varying(20) | NO | NULL | 20 |

### Indexes

- **ms_remittance_pause_status_pkey:** `CREATE UNIQUE INDEX ms_remittance_pause_status_pkey ON prc_mng.ms_remittance_pause_status USING btree (id_pas_status)`

---

## prc_mng.ms_remittance_principal_status {#prcmngmsremittanceprincipalstatus}

**Type:** BASE TABLE
**Row Count:** 6
**Primary Keys:** id_ppl_status

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_ppl_status | integer(32) | NO | nextval('prc_mng.ms_remittance_principal_status_id_ppl_status_seq'::regclass) | 32 |
| name | character varying(20) | NO | NULL | 20 |

### Indexes

- **ms_remittance_principal_status_pkey:** `CREATE UNIQUE INDEX ms_remittance_principal_status_pkey ON prc_mng.ms_remittance_principal_status USING btree (id_ppl_status)`

---

## prc_mng.ms_remittance_public_status {#prcmngmsremittancepublicstatus}

**Type:** BASE TABLE
**Row Count:** 4
**Primary Keys:** id_pub_status

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_pub_status | integer(32) | NO | nextval('prc_mng.ms_remittance_public_status_id_pub_status_seq'::regclass) | 32 |
| name | character varying(20) | NO | NULL | 20 |

### Indexes

- **ms_remittance_public_status_pkey:** `CREATE UNIQUE INDEX ms_remittance_public_status_pkey ON prc_mng.ms_remittance_public_status USING btree (id_pub_status)`

---

## prc_mng.ms_remittance_revision_status {#prcmngmsremittancerevisionstatus}

**Type:** BASE TABLE
**Row Count:** 3
**Primary Keys:** id_rev_status

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_rev_status | integer(32) | NO | nextval('prc_mng.ms_remittance_revision_status_id_rev_status_seq'::regclass) | 32 |
| name | character varying(20) | NO | NULL | 20 |

### Indexes

- **ms_remittance_revision_status_pkey:** `CREATE UNIQUE INDEX ms_remittance_revision_status_pkey ON prc_mng.ms_remittance_revision_status USING btree (id_rev_status)`

---

## prc_mng.ms_remittance_sell_cycle_status {#prcmngmsremittancesellcyclestatus}

**Type:** BASE TABLE
**Row Count:** 2
**Primary Keys:** id_sell_cycle_status

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_sell_cycle_status | integer(32) | NO | nextval('prc_mng.ms_remittance_sell_cycle_status_id_sell_cycle_status_seq'::regclass) | 32 |
| name | character varying(20) | NO | NULL | 20 |

### Indexes

- **ms_remittance_sell_cycle_status_pkey:** `CREATE UNIQUE INDEX ms_remittance_sell_cycle_status_pkey ON prc_mng.ms_remittance_sell_cycle_status USING btree (id_sell_cycle_status)`

---

## prc_mng.ms_req_workflow_asig_actions {#prcmngmsreqworkflowasigactions}

**Type:** BASE TABLE
**Row Count:** 9
**Primary Keys:** id_asig

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_asig | bigint(64) | NO | nextval('prc_mng.ms_req_workflow_asig_actions_id_asig_seq'::regclass) | 64 |
| id_origin_country | integer(32) | YES | NULL | 32 |
| serv_type | character varying(20) | NO | NULL | 20 |
| entity | character varying(20) | NO | NULL | 20 |
| grp_step | character varying(10) | NO | NULL | 10 |
| id_action | integer(32) | NO | NULL | 32 |
| to_grp_cord | boolean | NO | NULL | - |
| asig_type | character varying(20) | NO | NULL | 20 |

### Foreign Keys

| Column | References |
|--------|------------|
| id_action | prc_mng.ms_actions.id_action |

### Indexes

- **ms_req_workflow_asig_actions_pkey:** `CREATE UNIQUE INDEX ms_req_workflow_asig_actions_pkey ON prc_mng.ms_req_workflow_asig_actions USING btree (id_asig)`

---

## prc_mng.ms_result_type {#prcmngmsresulttype}

**Type:** BASE TABLE
**Row Count:** 2
**Primary Keys:** id_result_type

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_result_type | integer(32) | NO | nextval('prc_mng.ms_result_type_id_result_type_seq'::regclass) | 32 |
| name_result | character varying | NO | NULL | - |

### Indexes

- **ms_result_type_pkey:** `CREATE UNIQUE INDEX ms_result_type_pkey ON prc_mng.ms_result_type USING btree (id_result_type)`

---

## prc_mng.ms_sell_cycles {#prcmngmssellcycles}

**Type:** BASE TABLE
**Row Count:** 1
**Primary Keys:** id_sell_cycle

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_sell_cycle | bigint(64) | NO | nextval('prc_mng.ms_sell_cycles_id_sell_cycle_seq'::regclass) | 64 |
| name_cycle | character varying(50) | NO | NULL | 50 |
| date_created | timestamp with time zone | NO | now() | - |
| date_closed | timestamp with time zone | YES | NULL | - |
| id_balance | bigint(64) | NO | NULL | 64 |

### Foreign Keys

| Column | References |
|--------|------------|
| id_balance | prc_mng.ms_cycle_balances.id_balance |

### Indexes

- **ms_sell_cycles_pkey:** `CREATE UNIQUE INDEX ms_sell_cycles_pkey ON prc_mng.ms_sell_cycles USING btree (id_sell_cycle)`

---

## prc_mng.ms_third_party_users {#prcmngmsthirdpartyusers}

**Type:** BASE TABLE
**Row Count:** 1
**Primary Keys:** id_third_party_user

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_third_party_user | bigint(64) | NO | nextval('prc_mng.ms_third_party_users_id_third_party_user_seq'::regclass) | 64 |
| name | character varying | NO | NULL | - |
| lastname | character varying | NO | NULL | - |
| doc_number | character varying | NO | NULL | - |
| id_doc_type | integer(32) | NO | NULL | 32 |
| id_nationality | integer(32) | NO | NULL | 32 |
| id_resid_country | integer(32) | YES | NULL | 32 |
| profession | character varying | YES | NULL | - |
| email | character varying | YES | NULL | - |
| phone_number | character varying | YES | NULL | - |

### Indexes

- **ms_third_party_users_pkey:** `CREATE UNIQUE INDEX ms_third_party_users_pkey ON prc_mng.ms_third_party_users USING btree (id_third_party_user)`

---

## prc_mng.ms_transfer_fees {#prcmngmstransferfees}

**Type:** BASE TABLE
**Row Count:** 63
**Primary Keys:** id_transfer_fee

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_transfer_fee | bigint(64) | NO | nextval('prc_mng.ms_transfer_fees_id_transfer_fee_seq'::regclass) | 64 |
| id_bank_account | integer(32) | NO | NULL | 32 |
| amount | double precision(53) | NO | NULL | 53 |
| uuid_user | uuid | YES | NULL | - |
| date_created | timestamp with time zone | NO | now() | - |
| id_transfer | bigint(64) | YES | NULL | 64 |

### Foreign Keys

| Column | References |
|--------|------------|
| id_transfer | prc_mng.ms_cr_beneficiaries.id_beneficiary |

### Indexes

- **ms_transfer_fees_pkey:** `CREATE UNIQUE INDEX ms_transfer_fees_pkey ON prc_mng.ms_transfer_fees USING btree (id_transfer_fee)`

---

## prc_mng.ms_user_consult_types {#prcmngmsuserconsulttypes}

**Type:** BASE TABLE
**Row Count:** 6
**Primary Keys:** id_user_consult_type

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_user_consult_type | integer(32) | NO | nextval('prc_mng.ms_user_consult_types_id_user_consult_type_seq'::regclass) | 32 |
| type_name | character varying(40) | NO | NULL | 40 |

### Indexes

- **ms_user_consult_types_pkey:** `CREATE UNIQUE INDEX ms_user_consult_types_pkey ON prc_mng.ms_user_consult_types USING btree (id_user_consult_type)`

---

## prc_mng.ms_user_process_asings {#prcmngmsuserprocessasings}

**Type:** BASE TABLE
**Row Count:** 546
**Primary Keys:** id_proccess_asing

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_proccess_asing | bigint(64) | NO | nextval('prc_mng.ms_user_process_asings_id_proccess_asing_seq'::regclass) | 64 |
| current_active | boolean | NO | true | - |
| active | boolean | NO | true | - |
| create_date | timestamp with time zone | NO | now() | - |
| close_date | timestamp with time zone | YES | NULL | - |
| id_action | integer(32) | NO | NULL | 32 |
| id_consult | bigint(64) | YES | NULL | 64 |
| id_remittance | bigint(64) | YES | NULL | 64 |
| id_exchange | bigint(64) | YES | NULL | 64 |
| id_buy_cycle | bigint(64) | YES | NULL | 64 |
| id_sell_cycle | bigint(64) | YES | NULL | 64 |
| uuid_sixmap_user_asing | uuid | YES | NULL | - |
| asing_auto | boolean | NO | true | - |

### Foreign Keys

| Column | References |
|--------|------------|
| id_action | prc_mng.ms_actions.id_action |
| id_consult | prc_mng.lnk_user_consult.id_consult |
| id_exchange | prc_mng.lnk_cr_exchanges.id_exchange |
| id_remittance | prc_mng.lnk_cr_remittances.id_remittance |
| id_buy_cycle | prc_mng.ms_buy_cycles.id_buy_cycle |
| id_sell_cycle | prc_mng.ms_sell_cycles.id_sell_cycle |

### Indexes

- **ms_user_process_asings_pkey:** `CREATE UNIQUE INDEX ms_user_process_asings_pkey ON prc_mng.ms_user_process_asings USING btree (id_proccess_asing)`

---

## prc_mng.v_bank_accounts_actual_balances {#prcmngvbankaccountsactualbalances}

**Type:** VIEW
**Row Count:** 44
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_bank_account | bigint(64) | YES | NULL | 64 |
| name | character varying | YES | NULL | - |
| amount | double precision(53) | YES | NULL | 53 |
| currency | character varying(5) | YES | NULL | 5 |
| actual_assign_amount | double precision(53) | YES | NULL | 53 |

---

## prc_mng.v_bank_accounts_movements {#prcmngvbankaccountsmovements}

**Type:** VIEW
**Row Count:** 171
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| date_created | timestamp with time zone | YES | NULL | - |
| concept | text | YES | NULL | - |
| amount | double precision(53) | YES | NULL | 53 |
| id_bank_account | bigint(64) | YES | NULL | 64 |
| id_buy_cycle | bigint(64) | YES | NULL | 64 |
| id_sell_cycle | bigint(64) | YES | NULL | 64 |
| id_balance | bigint(64) | YES | NULL | 64 |

---

## prc_mng.v_bh_app_remittance_info {#prcmngvbhappremittanceinfo}

**Type:** VIEW
**Row Count:** 46
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_remittance | bigint(64) | YES | NULL | 64 |
| id_remittance_pub | character varying(20) | YES | NULL | 20 |
| client_name | text | YES | NULL | - |
| origin_country | character varying(255) | YES | NULL | 255 |
| destiny_country | character varying(255) | YES | NULL | 255 |
| origin_amount | double precision(53) | YES | NULL | 53 |
| destiny_amount | double precision(53) | YES | NULL | 53 |
| date_created | timestamp with time zone | YES | NULL | - |
| date_closed | timestamp with time zone | YES | NULL | - |
| array | ARRAY | YES | NULL | - |

---

## prc_mng.v_buy_cycle_currencies_detail {#prcmngvbuycyclecurrenciesdetail}

**Type:** VIEW
**Row Count:** 9
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_buy_cycle_currency | bigint(64) | YES | NULL | 64 |
| id_buy_cycle | bigint(64) | YES | NULL | 64 |
| name_cycle | character varying(50) | YES | NULL | 50 |
| id_currency | integer(32) | YES | NULL | 32 |
| name | character varying(50) | YES | NULL | 50 |
| iso_cod | character varying(5) | YES | NULL | 5 |
| total_amount_to_use | double precision(53) | YES | NULL | 53 |
| total_amount_to_use_verified | double precision(53) | YES | NULL | 53 |
| total_amount_used | double precision(53) | YES | NULL | 53 |
| total_buy_btc | double precision(53) | YES | NULL | 53 |
| total_buy_usdt | double precision(53) | YES | NULL | 53 |
| total_obtained_btc | double precision(53) | YES | NULL | 53 |

---

## prc_mng.v_buy_cycle_operations_detail {#prcmngvbuycycleoperationsdetail}

**Type:** VIEW
**Row Count:** 3
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_buy_cycle | bigint(64) | YES | NULL | 64 |
| uuid_sixmap_user | uuid | YES | NULL | - |
| username | character varying(100) | YES | NULL | 100 |
| type | text | YES | NULL | - |
| id_origin_currency | bigint(64) | YES | NULL | 64 |
| iso_cod | character varying(5) | YES | NULL | 5 |
| currency_abrev | character varying(10) | YES | NULL | 10 |
| id_bank_account | bigint(64) | YES | NULL | 64 |
| account_number | character varying(200) | YES | NULL | 200 |
| account_holder_name | character varying(100) | YES | NULL | 100 |
| id_exchange | integer(32) | YES | NULL | 32 |
| name | character varying | YES | NULL | - |
| fiat_amount_used | double precision(53) | YES | NULL | 53 |
| id_crypto_currency | bigint(64) | YES | NULL | 64 |
| crypto_amount_obtained | double precision(53) | YES | NULL | 53 |
| btc_amount_obtained | double precision(53) | YES | NULL | 53 |
| btc_rate_price | double precision(53) | YES | NULL | 53 |
| operation_cod | character varying | YES | NULL | - |
| date_created | timestamp with time zone | YES | NULL | - |
| id_exchange_account | bigint(64) | YES | NULL | 64 |
| exchange_account_name | character varying | YES | NULL | - |

---

## prc_mng.v_exchange_account_movements {#prcmngvexchangeaccountmovements}

**Type:** VIEW
**Row Count:** 0
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| date_created | timestamp with time zone | YES | NULL | - |
| concept | text | YES | NULL | - |
| amount | double precision(53) | YES | NULL | 53 |
| id_exchange_account | bigint(64) | YES | NULL | 64 |
| id_buy_cycle | bigint(64) | YES | NULL | 64 |
| id_sell_cycle | bigint(64) | YES | NULL | 64 |
| id_balance | bigint(64) | YES | NULL | 64 |
| currency | character varying(5) | YES | NULL | 5 |
| currency_abrev | character varying(10) | YES | NULL | 10 |
| id_currency | integer(32) | YES | NULL | 32 |

---

## prc_mng.v_exchanges_full_info {#prcmngvexchangesfullinfo}

**Type:** VIEW
**Row Count:** 0
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_exchange | bigint(64) | YES | NULL | 64 |
| id_exchange_pub | character varying | YES | NULL | - |
| id_origin_address | integer(32) | YES | NULL | 32 |
| id_destiny_address | integer(32) | YES | NULL | 32 |
| id_origin_currency | integer(32) | YES | NULL | 32 |
| id_destiny_currency | integer(32) | YES | NULL | 32 |
| origin_address_name | text | YES | NULL | - |
| origin_decimals_quant | integer(32) | YES | NULL | 32 |
| iso_code_origin_address | character varying | YES | NULL | - |
| iso_code_origin_currency | character varying(5) | YES | NULL | 5 |
| destiny_address_name | text | YES | NULL | - |
| destiny_decimals_quant | integer(32) | YES | NULL | 32 |
| iso_code_destiny_address | character varying | YES | NULL | - |
| iso_code_destiny_currency | character varying(5) | YES | NULL | 5 |
| date_created | bigint(64) | YES | NULL | 64 |
| date_last_modif | bigint(64) | YES | NULL | 64 |
| date_closed | bigint(64) | YES | NULL | 64 |
| exc_status_ppl | character varying(20) | YES | NULL | 20 |
| exc_atc_revision | character varying(20) | YES | NULL | 20 |
| exc_status_vf_bnk_org | character varying(20) | YES | NULL | 20 |
| exc_buy_cycle_status | character varying(20) | YES | NULL | 20 |
| exc_sell_cycle_status | character varying(20) | YES | NULL | 20 |
| exc_ok_award_status | character varying(20) | YES | NULL | 20 |
| exc_award_status | character varying(20) | YES | NULL | 20 |
| exc_ok_transf_status | character varying(20) | YES | NULL | 20 |
| exc_transf_status | character varying(20) | YES | NULL | 20 |
| exc_status_notif_cust | character varying(20) | YES | NULL | 20 |
| exc_status_pause | character varying(20) | YES | NULL | 20 |
| exc_in_claim | character varying(20) | YES | NULL | 20 |
| exc_status_pub | character varying(20) | YES | NULL | 20 |
| exc_modified_status | character varying(20) | YES | NULL | 20 |
| cust_cr_pub_id | character varying | YES | NULL | - |
| deposit_amount | double precision(53) | YES | NULL | 53 |
| fee | double precision(53) | YES | NULL | 53 |
| total_origin_amount | double precision(53) | YES | NULL | 53 |
| total_destiny_amount | double precision(53) | YES | NULL | 53 |
| rate_factor | double precision(53) | YES | NULL | 53 |
| rate_type | character varying(50) | YES | NULL | 50 |
| cr_exc_rs_atc | character varying(100) | YES | NULL | 100 |
| cr_exc_rs_notif_client | character varying(100) | YES | NULL | 100 |
| cr_exc_rs_vrf_bco | character varying(100) | YES | NULL | 100 |
| cr_exc_rs_transf | character varying(100) | YES | NULL | 100 |
| cr_exc_rs_buy_cycle | character varying(100) | YES | NULL | 100 |
| cr_exc_rs_sell_cycle | character varying(100) | YES | NULL | 100 |
| dep_rs_atc | text | YES | NULL | - |
| dep_rs_vrf_bnk | text | YES | NULL | - |
| dep_rs_buy_cycle | character varying | YES | NULL | - |
| dep_rs_sell_cycle | character varying | YES | NULL | - |
| dep_rs_transf | text | YES | NULL | - |
| dep_rs_notif | text | YES | NULL | - |
| client_name | text | YES | NULL | - |
| client_first_name | character varying(100) | YES | NULL | 100 |
| client_gender | character(1) | YES | NULL | 1 |
| id_pub_cod_client | character varying | YES | NULL | - |
| type | character varying | YES | NULL | - |
| id_exchange_rate | integer(32) | YES | NULL | 32 |
| ident_doc_number | character varying(30) | YES | NULL | 30 |
| email_client | character varying(100) | YES | NULL | 100 |
| phone_client | character varying(20) | YES | NULL | 20 |
| origin_bank | character varying(100) | YES | NULL | 100 |
| account_number | character varying | YES | NULL | - |
| is_whatsapp | boolean | YES | NULL | - |
| buy_cycle | character varying(50) | YES | NULL | 50 |
| sell_cycle | character varying(50) | YES | NULL | 50 |
| modif_version | integer(32) | YES | NULL | 32 |
| pay_method | character varying(40) | YES | NULL | 40 |
| exchange_type | text | YES | NULL | - |
| network | json | YES | NULL | - |
| user_account | json | YES | NULL | - |
| user_wallet | json | YES | NULL | - |
| captures | json | YES | NULL | - |
| company_wallet | json | YES | NULL | - |
| transf_to_client_conf_num | character varying | YES | NULL | - |
| transf_to_client_cap | text | YES | NULL | - |

---

## prc_mng.v_full_exchange_rates {#prcmngvfullexchangerates}

**Type:** VIEW
**Row Count:** 57
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_exchange_rate | bigint(64) | YES | NULL | 64 |
| id_operation_route | integer(32) | YES | NULL | 32 |
| id_rate_type | integer(32) | YES | NULL | 32 |
| rate_factor | double precision(53) | YES | NULL | 53 |
| profit_margin | double precision(53) | YES | NULL | 53 |
| active | boolean | YES | NULL | - |
| date_creation | timestamp with time zone | YES | NULL | - |
| date_last_modif | timestamp with time zone | YES | NULL | - |
| used_cost_factor | double precision(53) | YES | NULL | 53 |

---

## prc_mng.v_lnk_cr_remittances_info {#prcmngvlnkcrremittancesinfo}

**Type:** VIEW
**Row Count:** 0
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_remittance | bigint(64) | YES | NULL | 64 |
| id_remittance_pub | character varying(20) | YES | NULL | 20 |
| id_rate | integer(32) | YES | NULL | 32 |
| id_origin_country | integer(32) | YES | NULL | 32 |
| id_destiny_country | integer(32) | YES | NULL | 32 |
| cr_rem_status_ppl | character varying(30) | YES | NULL | 30 |
| cr_rem_status_sec | character varying(30) | YES | NULL | 30 |
| cr_rem_status_detour | character varying(30) | YES | NULL | 30 |
| cr_rem_status_vf_bnk_org | boolean | YES | NULL | - |
| cr_rem_ok_trans_dest | boolean | YES | NULL | - |
| cr_rem_status_notif_cust | boolean | YES | NULL | - |
| cr_rem_in_claim | boolean | YES | NULL | - |
| date_created | timestamp with time zone | YES | NULL | - |
| date_closed | timestamp with time zone | YES | NULL | - |
| id_currency_origin | integer(32) | YES | NULL | 32 |
| origin_deposit_amount | double precision(53) | YES | NULL | 53 |
| origin_comission | double precision(53) | YES | NULL | 53 |
| total_origin_amount | double precision(53) | YES | NULL | 53 |
| id_currency_destiny | integer(32) | YES | NULL | 32 |
| total_destiny_amount | double precision(53) | YES | NULL | 53 |
| id_client | integer(32) | YES | NULL | 32 |
| username | character varying(100) | YES | NULL | 100 |
| first_name | character varying(100) | YES | NULL | 100 |
| last_name | character varying(100) | YES | NULL | 100 |
| name_profile | character varying(20) | YES | NULL | 20 |
| uuid_user_asing | uuid | YES | NULL | - |
| id_origin_account | integer(32) | YES | NULL | 32 |
| account_number | character varying(200) | YES | NULL | 200 |
| country_origin | character varying(255) | YES | NULL | 255 |
| country_destiny | character varying(255) | YES | NULL | 255 |
| currency_origin_iso_code | character varying(5) | YES | NULL | 5 |
| currency_destiny_iso_code | character varying(5) | YES | NULL | 5 |
| beneficiaries | ARRAY | YES | NULL | - |
| id_origin_bank | integer(32) | YES | NULL | 32 |
| origin_bank | character varying(100) | YES | NULL | 100 |

---

## prc_mng.v_ms_buy_cycle_detail {#prcmngvmsbuycycledetail}

**Type:** VIEW
**Row Count:** 1
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_buy_cycle | bigint(64) | YES | NULL | 64 |
| name_cycle | character varying(50) | YES | NULL | 50 |
| date_created | timestamp with time zone | YES | NULL | - |
| date_closed | timestamp with time zone | YES | NULL | - |
| partial_operations | bigint(64) | YES | NULL | 64 |
| total_buy_btc_amount | double precision(53) | YES | NULL | 53 |
| total_buy_usdt_amount | double precision(53) | YES | NULL | 53 |
| total_btc_obtained | double precision(53) | YES | NULL | 53 |

---

## prc_mng.v_ms_emp_sixmap_to_asing {#prcmngvmsempsixmaptoasing}

**Type:** VIEW
**Row Count:** 1
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_emp | bigint(64) | YES | NULL | 64 |
| uuid_user | uuid | YES | NULL | - |
| name_emp | character varying(100) | YES | NULL | 100 |
| lastname_emp | character varying(100) | YES | NULL | 100 |
| username | character varying(100) | YES | NULL | 100 |
| profile | character varying(20) | YES | NULL | 20 |

---

## prc_mng.v_ms_log_action_com_info {#prcmngvmslogactioncominfo}

**Type:** VIEW
**Row Count:** 134
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_log_action | integer(32) | YES | NULL | 32 |
| id_remittance_pub | character varying(20) | YES | NULL | 20 |
| log_action_date | timestamp with time zone | YES | NULL | - |
| name_dpt | text | YES | NULL | - |
| username | character varying(100) | YES | NULL | 100 |
| action | character varying | YES | NULL | - |
| action_value | character varying(45) | YES | NULL | 45 |
| action_comment | character varying(100) | YES | NULL | 100 |
| active | boolean | YES | NULL | - |
| id_remittance | bigint(64) | YES | NULL | 64 |
| id_exchange_pub | character varying | YES | NULL | - |
| id_exchange | bigint(64) | YES | NULL | 64 |
| oper_type | text | YES | NULL | - |
| alert | boolean | YES | NULL | - |

---

## prc_mng.v_ms_sell_cycle_detail {#prcmngvmssellcycledetail}

**Type:** VIEW
**Row Count:** 1
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_sell_cycle | bigint(64) | YES | NULL | 64 |
| name_cycle | character varying(50) | YES | NULL | 50 |
| date_created | timestamp with time zone | YES | NULL | - |
| date_closed | timestamp with time zone | YES | NULL | - |
| partial_operations | bigint(64) | YES | NULL | 64 |
| total_sell_btc_amount | double precision(53) | YES | NULL | 53 |
| total_sell_usdt_amount | double precision(53) | YES | NULL | 53 |
| total_btc_used | double precision(53) | YES | NULL | 53 |

---

## prc_mng.v_ms_sixmap_users_current_asings_by_user {#prcmngvmssixmapuserscurrentasingsbyuser}

**Type:** VIEW
**Row Count:** 1
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_emp | bigint(64) | YES | NULL | 64 |
| uuid_user | uuid | YES | NULL | - |
| name_emp | character varying(100) | YES | NULL | 100 |
| lastname_emp | character varying(100) | YES | NULL | 100 |
| username | character varying(100) | YES | NULL | 100 |
| profile | character varying(20) | YES | NULL | 20 |
| total_asings | bigint(64) | YES | NULL | 64 |
| last_asing_date | timestamp with time zone | YES | NULL | - |

---

## prc_mng.v_queue_balances {#prcmngvqueuebalances}

**Type:** VIEW
**Row Count:** 28
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_bank | integer(32) | YES | NULL | 32 |
| quantity | bigint(64) | YES | NULL | 64 |
| amount | numeric | YES | NULL | - |

---

## prc_mng.v_remittances_status_info {#prcmngvremittancesstatusinfo}

**Type:** VIEW
**Row Count:** 192
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_remittance | bigint(64) | YES | NULL | 64 |
| id_remittance_pub | character varying(20) | YES | NULL | 20 |
| id_origin_country | integer(32) | YES | NULL | 32 |
| id_origin_currency | integer(32) | YES | NULL | 32 |
| id_destiny_country | integer(32) | YES | NULL | 32 |
| id_destiny_currency | integer(32) | YES | NULL | 32 |
| date_created | bigint(64) | YES | NULL | 64 |
| date_closed | bigint(64) | YES | NULL | 64 |
| cr_rem_status_ppl | character varying(20) | YES | NULL | 20 |
| cr_rem_atc_revision | character varying(20) | YES | NULL | 20 |
| cr_rem_status_vf_bnk_org | character varying(20) | YES | NULL | 20 |
| cr_rem_to_tranf_status | boolean | YES | NULL | - |
| cr_rem_ok_trans_dest | boolean | YES | NULL | - |
| cr_rem_status_notif_cust | boolean | YES | NULL | - |
| cr_rem_status_notif_benef | character varying(20) | YES | NULL | 20 |
| cr_rem_status_detour | character varying(20) | YES | NULL | 20 |
| cr_rem_in_claim | character varying(20) | YES | NULL | 20 |
| cr_rem_status_pub | character varying(20) | YES | NULL | 20 |
| cust_cr_pub_id | character varying | YES | NULL | - |
| deposit_amount | double precision(53) | YES | NULL | 53 |
| comission | double precision(53) | YES | NULL | 53 |
| cr_rem_total_origin_amount | double precision(53) | YES | NULL | 53 |
| rate_factor | double precision(53) | YES | NULL | 53 |
| cr_rem_total_dest_amount | double precision(53) | YES | NULL | 53 |
| cust_name | text | YES | NULL | - |
| id_pub_cod_client | character varying | YES | NULL | - |
| type | character varying | YES | NULL | - |
| id_manual_rate | integer(32) | YES | NULL | 32 |
| rate_type | character varying(50) | YES | NULL | 50 |
| ident_doc_number | character varying(30) | YES | NULL | 30 |
| email_client | character varying(100) | YES | NULL | 100 |
| phone_client | character varying(20) | YES | NULL | 20 |
| origin_bank | character varying(100) | YES | NULL | 100 |
| account_number | character varying(200) | YES | NULL | 200 |
| date_last_modif | bigint(64) | YES | NULL | 64 |
| is_whatsapp | boolean | YES | NULL | - |
| rate_operation | character(3) | YES | NULL | 3 |
| uuid_user_cust | uuid | YES | NULL | - |
| pay_method | character varying(40) | YES | NULL | 40 |
| id_bank_account | integer(32) | YES | NULL | 32 |
| id_resid_country | bigint(64) | YES | NULL | 64 |
| resid_country | character varying(255) | YES | NULL | 255 |
| phone_exception | boolean | YES | NULL | - |
| country_exception | boolean | YES | NULL | - |
| limit_exception | boolean | YES | NULL | - |
| multi_currency_exception | boolean | YES | NULL | - |
| verif_level | integer(32) | YES | NULL | 32 |
| id_nationality_country | integer(32) | YES | NULL | 32 |
| urgent | boolean | YES | NULL | - |
| priority | boolean | YES | NULL | - |
| client_status | text | YES | NULL | - |
| cr_rem_total_benef | integer(32) | YES | NULL | 32 |
| phone_changed | boolean | YES | NULL | - |
| origin_country | character varying(255) | YES | NULL | 255 |
| destiny_country | character varying(255) | YES | NULL | 255 |
| origin_currency | character varying(5) | YES | NULL | 5 |
| destiny_currency | character varying(5) | YES | NULL | 5 |
| cr_id_rem_status_ppl | integer(32) | YES | NULL | 32 |
| cr_id_rem_atc_revision | integer(32) | YES | NULL | 32 |
| cr_id_rem_status_vf_bnk_org | integer(32) | YES | NULL | 32 |
| cr_id_rem_status_notif_benef | integer(32) | YES | NULL | 32 |
| cr_id_rem_status_detour | integer(32) | YES | NULL | 32 |
| cr_id_rem_in_claim | integer(32) | YES | NULL | 32 |
| cr_id_rem_status_pub | integer(32) | YES | NULL | 32 |

---

## prc_mng.v_sell_cycle_currencies_detail {#prcmngvsellcyclecurrenciesdetail}

**Type:** VIEW
**Row Count:** 10
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_sell_cycle_currency | bigint(64) | YES | NULL | 64 |
| id_sell_cycle | bigint(64) | YES | NULL | 64 |
| name_cycle | character varying(50) | YES | NULL | 50 |
| id_currency | integer(32) | YES | NULL | 32 |
| name | character varying(50) | YES | NULL | 50 |
| iso_cod | character varying(5) | YES | NULL | 5 |
| total_amount_to_obtain | double precision(53) | YES | NULL | 53 |
| total_amount_to_obtain_verified | double precision(53) | YES | NULL | 53 |
| total_amount_obtained | double precision(53) | YES | NULL | 53 |
| total_sell_btc | double precision(53) | YES | NULL | 53 |
| total_sell_usdt | double precision(53) | YES | NULL | 53 |
| total_used_btc | double precision(53) | YES | NULL | 53 |

---

## prc_mng.v_sell_cycle_operations_detail {#prcmngvsellcycleoperationsdetail}

**Type:** VIEW
**Row Count:** 4
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_sell_cycle | bigint(64) | YES | NULL | 64 |
| uuid_sixmap_user | uuid | YES | NULL | - |
| username | character varying(100) | YES | NULL | 100 |
| type | text | YES | NULL | - |
| id_destiny_currency | bigint(64) | YES | NULL | 64 |
| iso_cod | character varying(5) | YES | NULL | 5 |
| currency_abrev | character varying(10) | YES | NULL | 10 |
| id_bank_account | bigint(64) | YES | NULL | 64 |
| account_number | character varying(200) | YES | NULL | 200 |
| account_holder_name | character varying(100) | YES | NULL | 100 |
| id_exchange | integer(32) | YES | NULL | 32 |
| name | character varying | YES | NULL | - |
| fiat_amount_obtained | double precision(53) | YES | NULL | 53 |
| id_crypto_currency | bigint(64) | YES | NULL | 64 |
| crypto_amount_used | double precision(53) | YES | NULL | 53 |
| btc_amount_used | double precision(53) | YES | NULL | 53 |
| btc_rate_price | double precision(53) | YES | NULL | 53 |
| operation_cod | character varying | YES | NULL | - |
| date_created | timestamp with time zone | YES | NULL | - |
| id_exchange_account | bigint(64) | YES | NULL | 64 |
| exchange_account_name | character varying | YES | NULL | - |

---

## prc_mng.v_transfers_to_do {#prcmngvtransferstodo}

**Type:** VIEW
**Row Count:** 31
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_remittance | bigint(64) | YES | NULL | 64 |
| date_created | bigint(64) | YES | NULL | 64 |
| verif_bank_date | bigint(64) | YES | NULL | 64 |
| to_tranf_date | bigint(64) | YES | NULL | 64 |
| id_beneficiary | bigint(64) | YES | NULL | 64 |
| name | character varying(50) | YES | NULL | 50 |
| doc_type | character varying(50) | YES | NULL | 50 |
| ident_number | character varying(50) | YES | NULL | 50 |
| pay_type | character varying(40) | YES | NULL | 40 |
| bank_code | character varying | YES | NULL | - |
| country | character varying(255) | YES | NULL | 255 |
| currency | character varying(5) | YES | NULL | 5 |
| amount | double precision(53) | YES | NULL | 53 |
| account | character varying(50) | YES | NULL | 50 |
| account_type | character varying(50) | YES | NULL | 50 |
| phone_number | character varying(50) | YES | NULL | 50 |

---

## prc_mng.v_transfers_to_do_massive_data {#prcmngvtransferstodomassivedata}

**Type:** VIEW
**Row Count:** 177
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_remittance | bigint(64) | YES | NULL | 64 |
| date_created | bigint(64) | YES | NULL | 64 |
| verif_bank_date | bigint(64) | YES | NULL | 64 |
| to_tranf_date | bigint(64) | YES | NULL | 64 |
| id_beneficiary | bigint(64) | YES | NULL | 64 |
| name | character varying(50) | YES | NULL | 50 |
| doc_type | character varying(50) | YES | NULL | 50 |
| ident_number | character varying(50) | YES | NULL | 50 |
| pay_type | character varying(40) | YES | NULL | 40 |
| bank_code | character varying | YES | NULL | - |
| country | character varying(255) | YES | NULL | 255 |
| currency | character varying(5) | YES | NULL | 5 |
| amount | double precision(53) | YES | NULL | 53 |
| account | character varying(50) | YES | NULL | 50 |
| account_type | character varying(50) | YES | NULL | 50 |
| phone_number | character varying(50) | YES | NULL | 50 |

---

## priv.ms_sixmap_users {#privmssixmapusers}

**Type:** BASE TABLE
**Row Count:** 5.189
**Primary Keys:** id_user_priv

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_user_priv | bigint(64) | NO | nextval('priv.ms_sixmap_users_id_user_priv_seq'::regclass) | 64 |
| first_name | character varying(100) | NO | NULL | 100 |
| second_name | character varying(100) | YES | NULL | 100 |
| last_name | character varying(100) | NO | NULL | 100 |
| second_last_name | character varying(100) | YES | NULL | 100 |

### Indexes

- **ms_sixmap_users_pkey:** `CREATE UNIQUE INDEX ms_sixmap_users_pkey ON priv.ms_sixmap_users USING btree (id_user_priv)`

---

## public.full_user {#publicfulluser}

**Type:** BASE TABLE
**Row Count:** 0
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| jsonb_agg | jsonb | YES | NULL | - |

---

## sec_cust.env_variables {#seccustenvvariables}

**Type:** BASE TABLE
**Row Count:** 2
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| key | text | YES | NULL | - |
| value | text | YES | NULL | - |

---

## sec_cust.lnk_bank_currencies {#seccustlnkbankcurrencies}

**Type:** BASE TABLE
**Row Count:** 24
**Primary Keys:** id_bank_currency

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_bank_currency | integer(32) | NO | nextval('sec_cust.lnk_bank_currencies_id_bank_currency_seq'::regclass) | 32 |
| id_bank | integer(32) | NO | NULL | 32 |
| id_currency | integer(32) | NO | NULL | 32 |

### Foreign Keys

| Column | References |
|--------|------------|
| id_bank | sec_cust.ms_banks.id_bank |
| id_currency | sec_cust.ms_currencies.id_currency |

### Indexes

- **lnk_bank_currencies_pkey:** `CREATE UNIQUE INDEX lnk_bank_currencies_pkey ON sec_cust.lnk_bank_currencies USING btree (id_bank_currency)`

---

## sec_cust.lnk_bank_pay_method {#seccustlnkbankpaymethod}

**Type:** BASE TABLE
**Row Count:** 689
**Primary Keys:** id_bank_pay_method

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_bank_pay_method | bigint(64) | NO | nextval('sec_cust.lnk_bank_pay_method_id_bank_pay_method_seq'::regclass) | 64 |
| id_bank | bigint(64) | YES | NULL | 64 |
| id_pay_method | bigint(64) | YES | NULL | 64 |

### Foreign Keys

| Column | References |
|--------|------------|
| id_bank | sec_cust.ms_banks.id_bank |
| id_pay_method | sec_cust.ms_pay_methods.id_pay_method |

### Indexes

- **lnk_bank_pay_method_pkey:** `CREATE UNIQUE INDEX lnk_bank_pay_method_pkey ON sec_cust.lnk_bank_pay_method USING btree (id_bank_pay_method)`

---

## sec_cust.lnk_country_currency {#seccustlnkcountrycurrency}

**Type:** BASE TABLE
**Row Count:** 14
**Primary Keys:** id_cou_cur

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_cou_cur | integer(32) | NO | nextval('sec_cust.lnk_country_currency_id_cou_cur_seq'::regclass) | 32 |
| id_currency | integer(32) | NO | NULL | 32 |
| id_country | integer(32) | NO | NULL | 32 |

### Foreign Keys

| Column | References |
|--------|------------|
| id_currency | sec_cust.ms_currencies.id_currency |

### Indexes

- **lnk_country_currency_pkey:** `CREATE UNIQUE INDEX lnk_country_currency_pkey ON sec_cust.lnk_country_currency USING btree (id_cou_cur)`

---

## sec_cust.lnk_limit_vl {#seccustlnklimitvl}

**Type:** BASE TABLE
**Row Count:** 180
**Primary Keys:** id_limit_vl

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_limit_vl | bigint(64) | NO | nextval('sec_cust.lnk_limit_vl_id_limit_vl_seq'::regclass) | 64 |
| def | character varying | YES | NULL | - |
| standard_amount | double precision(53) | YES | NULL | 53 |
| local_amount | double precision(53) | YES | NULL | 53 |
| local_amount_2 | double precision(53) | YES | NULL | 53 |
| beneficiaries_num | integer(32) | YES | NULL | 32 |
| is_allowed | boolean | YES | NULL | - |
| id_limitation | integer(32) | NO | NULL | 32 |
| id_verification | integer(32) | NO | NULL | 32 |
| id_country | integer(32) | NO | NULL | 32 |
| active | boolean | NO | NULL | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |

### Foreign Keys

| Column | References |
|--------|------------|
| id_limitation | sec_cust.ms_limitations.id_limitation |
| id_verification | sec_cust.ms_verifications.id_verification |

### Indexes

- **lnk_limit_vl_pkey:** `CREATE UNIQUE INDEX lnk_limit_vl_pkey ON sec_cust.lnk_limit_vl USING btree (id_limit_vl)`

---

## sec_cust.lnk_limit_vl_country {#seccustlnklimitvlcountry}

**Type:** BASE TABLE
**Row Count:** 184
**Primary Keys:** id_limit_vl_country

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_limit_vl_country | bigint(64) | NO | nextval('sec_cust.lnk_limit_vl_country_id_limit_vl_country_seq'::regclass) | 64 |
| id_limit_vl | integer(32) | NO | NULL | 32 |
| id_country | integer(32) | NO | NULL | 32 |
| active | boolean | NO | NULL | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |

### Foreign Keys

| Column | References |
|--------|------------|
| id_limit_vl | sec_cust.lnk_limit_vl.id_limit_vl |

### Indexes

- **lnk_limit_vl_country_pkey:** `CREATE UNIQUE INDEX lnk_limit_vl_country_pkey ON sec_cust.lnk_limit_vl_country USING btree (id_limit_vl_country)`

---

## sec_cust.lnk_mail_user {#seccustlnkmailuser}

**Type:** BASE TABLE
**Row Count:** 0
**Primary Keys:** id_mail_user

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_mail_user | bigint(64) | NO | nextval('sec_cust.lnk_mail_user_id_mail_user_seq'::regclass) | 64 |
| sent | boolean | NO | false | - |
| id_mail | bigint(64) | NO | NULL | 64 |
| id_user | bigint(64) | NO | NULL | 64 |

### Foreign Keys

| Column | References |
|--------|------------|
| id_mail | sec_cust.ms_mail.id_mail |
| id_user | sec_cust.ms_sixmap_users.id_user |

### Indexes

- **lnk_mail_user_pkey:** `CREATE UNIQUE INDEX lnk_mail_user_pkey ON sec_cust.lnk_mail_user USING btree (id_mail_user)`

---

## sec_cust.lnk_opspwds_registred_by_user {#seccustlnkopspwdsregistredbyuser}

**Type:** BASE TABLE
**Row Count:** 0
**Primary Keys:** id_opspwd

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_opspwd | bigint(64) | NO | nextval('sec_cust.lnk_opspwds_registred_by_user_id_opspwd_seq'::regclass) | 64 |
| opspwd | text | NO | NULL | - |
| active | boolean | NO | NULL | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |
| uuid_user | uuid | NO | NULL | - |

### Foreign Keys

| Column | References |
|--------|------------|
| uuid_user | sec_cust.ms_sixmap_users.uuid_user |

### Indexes

- **lnk_opspwds_registred_by_user_pkey:** `CREATE UNIQUE INDEX lnk_opspwds_registred_by_user_pkey ON sec_cust.lnk_opspwds_registred_by_user USING btree (id_opspwd)`

---

## sec_cust.lnk_profiles_roles {#seccustlnkprofilesroles}

**Type:** BASE TABLE
**Row Count:** 0
**Primary Keys:** id_profiles_roles

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_profiles_roles | bigint(64) | NO | nextval('sec_cust.lnk_profiles_roles_id_profiles_roles_seq'::regclass) | 64 |
| active | boolean | NO | NULL | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |
| uuid_profile | uuid | NO | NULL | - |
| uuid_role | uuid | NO | NULL | - |

### Foreign Keys

| Column | References |
|--------|------------|
| uuid_profile | sec_cust.ms_profiles.uuid_profile |
| uuid_role | sec_cust.ms_roles.uuid_role |
| uuid_role | sec_cust.ms_roles.uuid_role |
| uuid_role | sec_cust.ms_roles.uuid_role |
| uuid_role | sec_cust.ms_roles.uuid_role |

### Indexes

- **lnk_profiles_roles_pkey:** `CREATE UNIQUE INDEX lnk_profiles_roles_pkey ON sec_cust.lnk_profiles_roles USING btree (id_profiles_roles)`

---

## sec_cust.lnk_pwds_registred_by_user {#seccustlnkpwdsregistredbyuser}

**Type:** BASE TABLE
**Row Count:** 5.075
**Primary Keys:** id_pwd

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_pwd | bigint(64) | NO | nextval('sec_cust.lnk_pwds_registred_by_user_id_pwd_seq'::regclass) | 64 |
| pwd | text | NO | NULL | - |
| active | boolean | NO | NULL | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |
| uuid_user | uuid | NO | NULL | - |

### Foreign Keys

| Column | References |
|--------|------------|
| uuid_user | sec_cust.ms_sixmap_users.uuid_user |

### Indexes

- **lnk_pwds_registred_by_user_pkey:** `CREATE UNIQUE INDEX lnk_pwds_registred_by_user_pkey ON sec_cust.lnk_pwds_registred_by_user USING btree (id_pwd)`

---

## sec_cust.lnk_range_rates {#seccustlnkrangerates}

**Type:** BASE TABLE
**Row Count:** 717
**Primary Keys:** id_range_rates

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_range_rates | bigint(64) | NO | nextval('sec_cust.lnk_range_rates_id_range_rates_seq'::regclass) | 64 |
| lower_limit | double precision(53) | NO | NULL | 53 |
| upper_limit | double precision(53) | YES | NULL | 53 |
| min_amount | double precision(53) | NO | NULL | 53 |
| id_rate_type | integer(32) | NO | NULL | 32 |
| id_cou_cur_origin | integer(32) | NO | NULL | 32 |
| id_cou_cur_destiny | integer(32) | NO | NULL | 32 |
| active | boolean | NO | NULL | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |

### Foreign Keys

| Column | References |
|--------|------------|
| id_cou_cur_destiny | sec_cust.lnk_country_currency.id_cou_cur |
| id_cou_cur_origin | sec_cust.lnk_country_currency.id_cou_cur |
| id_rate_type | sec_cust.ms_cr_rate_type.id_rate_type |

### Indexes

- **lnk_range_rates_pkey:** `CREATE UNIQUE INDEX lnk_range_rates_pkey ON sec_cust.lnk_range_rates USING btree (id_range_rates)`

---

## sec_cust.lnk_roles_routes {#seccustlnkrolesroutes}

**Type:** BASE TABLE
**Row Count:** 0
**Primary Keys:** id_roles_routes

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_roles_routes | bigint(64) | NO | nextval('sec_cust.lnk_roles_routes_id_roles_routes_seq'::regclass) | 64 |
| active | boolean | NO | NULL | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |
| uuid_role | uuid | NO | NULL | - |
| uuid_route | uuid | NO | NULL | - |

### Foreign Keys

| Column | References |
|--------|------------|
| uuid_role | sec_cust.ms_roles.uuid_role |
| uuid_role | sec_cust.ms_roles.uuid_role |
| uuid_role | sec_cust.ms_roles.uuid_role |
| uuid_role | sec_cust.ms_roles.uuid_role |
| uuid_route | sec_cust.ms_routes.uuid_route |

### Indexes

- **lnk_roles_routes_pkey:** `CREATE UNIQUE INDEX lnk_roles_routes_pkey ON sec_cust.lnk_roles_routes USING btree (id_roles_routes)`

---

## sec_cust.lnk_users_departments {#seccustlnkusersdepartments}

**Type:** BASE TABLE
**Row Count:** 0
**Primary Keys:** id_users_depts

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_users_depts | bigint(64) | NO | nextval('sec_cust.lnk_users_departments_id_users_depts_seq'::regclass) | 64 |
| active | boolean | NO | NULL | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |
| uuid_user | uuid | NO | NULL | - |
| id_dpt | integer(32) | NO | NULL | 32 |

### Foreign Keys

| Column | References |
|--------|------------|
| id_dpt | sec_cust.ms_departments.id_dpt |
| uuid_user | sec_cust.ms_sixmap_users.uuid_user |

### Indexes

- **lnk_users_departments_pkey:** `CREATE UNIQUE INDEX lnk_users_departments_pkey ON sec_cust.lnk_users_departments USING btree (id_users_depts)`

---

## sec_cust.lnk_users_extra_data {#seccustlnkusersextradata}

**Type:** BASE TABLE
**Row Count:** 6
**Primary Keys:** id_extra_data

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_extra_data | bigint(64) | NO | nextval('sec_cust.lnk_users_extra_data_id_extra_data_seq'::regclass) | 64 |
| value | text | NO | NULL | - |
| edited | boolean | NO | false | - |
| id_user | bigint(64) | NO | NULL | 64 |
| id_item | integer(32) | NO | NULL | 32 |

### Foreign Keys

| Column | References |
|--------|------------|
| id_item | sec_cust.ms_item.id_item |
| id_user | sec_cust.ms_sixmap_users.id_user |

### Indexes

- **lnk_users_extra_data_pkey:** `CREATE UNIQUE INDEX lnk_users_extra_data_pkey ON sec_cust.lnk_users_extra_data USING btree (id_extra_data)`

---

## sec_cust.lnk_users_loyalty_levels {#seccustlnkusersloyaltylevels}

**Type:** BASE TABLE
**Row Count:** 0
**Primary Keys:** id_user_loyalty

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_user_loyalty | bigint(64) | NO | nextval('sec_cust.lnk_users_loyalty_levels_id_user_loyalty_seq'::regclass) | 64 |
| id_loyalty | integer(32) | YES | NULL | 32 |
| uuid_user | uuid | YES | NULL | - |
| date_last_modif | timestamp with time zone | YES | now() | - |

### Foreign Keys

| Column | References |
|--------|------------|
| id_loyalty | sec_cust.loyalty_levels.id_loyalty |
| uuid_user | sec_cust.ms_sixmap_users.uuid_user |

### Indexes

- **lnk_users_loyalty_levels_pkey:** `CREATE UNIQUE INDEX lnk_users_loyalty_levels_pkey ON sec_cust.lnk_users_loyalty_levels USING btree (id_user_loyalty)`

---

## sec_cust.lnk_users_risk_levels {#seccustlnkusersrisklevels}

**Type:** BASE TABLE
**Row Count:** 0
**Primary Keys:** id_user_risk

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_user_risk | bigint(64) | NO | nextval('sec_cust.lnk_users_risk_levels_id_user_risk_seq'::regclass) | 64 |
| id_risk | integer(32) | YES | NULL | 32 |
| uuid_user | uuid | YES | NULL | - |
| date_last_modif | timestamp with time zone | YES | now() | - |

### Foreign Keys

| Column | References |
|--------|------------|
| id_risk | sec_cust.risk_levels.id_risk |
| uuid_user | sec_cust.ms_sixmap_users.uuid_user |

### Indexes

- **lnk_users_risk_levels_pkey:** `CREATE UNIQUE INDEX lnk_users_risk_levels_pkey ON sec_cust.lnk_users_risk_levels USING btree (id_user_risk)`

---

## sec_cust.lnk_users_verif_level {#seccustlnkusersveriflevel}

**Type:** BASE TABLE
**Row Count:** 10.109
**Primary Keys:** id_users_verif_level

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_users_verif_level | bigint(64) | NO | nextval('sec_cust.lnk_users_verif_level_id_users_verif_level_seq'::regclass) | 64 |
| id_vl | integer(32) | YES | NULL | 32 |
| level_apb_ok | boolean | YES | NULL | - |
| level_req | jsonb | YES | NULL | - |
| active | boolean | NO | NULL | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |
| id_service | integer(32) | NO | NULL | 32 |
| uuid_user | uuid | NO | NULL | - |
| id_verif_level | integer(32) | YES | NULL | 32 |
| id_resid_country | integer(32) | NO | NULL | 32 |
| doc | character varying | YES | NULL | - |
| comment | character varying | YES | NULL | - |
| is_the_last_one | boolean | YES | NULL | - |
| silt_id | character varying | YES | NULL | - |

### Foreign Keys

| Column | References |
|--------|------------|
| id_service | sec_cust.ms_sixmap_services.id_service |
| uuid_user | sec_cust.ms_sixmap_users.uuid_user |
| id_verif_level | sec_cust.ms_verif_level.id_verif_level |

### Indexes

- **lnk_users_verif_level_pkey:** `CREATE UNIQUE INDEX lnk_users_verif_level_pkey ON sec_cust.lnk_users_verif_level USING btree (id_users_verif_level)`

---

## sec_cust.logs_actions_obj {#seccustlogsactionsobj}

**Type:** BASE TABLE
**Row Count:** 61.206
**Primary Keys:** id_log

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_log | bigint(64) | NO | nextval('sec_cust.logs_actions_obj_id_log_seq'::regclass) | 64 |
| is_authenticated | boolean | NO | NULL | - |
| success_req | boolean | YES | NULL | - |
| failed_req | boolean | YES | NULL | - |
| ip_orig | character varying(100) | NO | NULL | 100 |
| country_ip_orig | text | YES | NULL | - |
| route | text | YES | NULL | - |
| params | json | YES | NULL | - |
| query | json | YES | NULL | - |
| body | json | YES | NULL | - |
| status | integer(32) | YES | NULL | 32 |
| response | json | YES | NULL | - |
| active | boolean | NO | true | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |
| sid_session | text | YES | NULL | - |

### Indexes

- **logs_actions_obj_pkey:** `CREATE UNIQUE INDEX logs_actions_obj_pkey ON sec_cust.logs_actions_obj USING btree (id_log)`

---

## sec_cust.loyalty_levels {#seccustloyaltylevels}

**Type:** BASE TABLE
**Row Count:** 4
**Primary Keys:** id_loyalty

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_loyalty | bigint(64) | NO | nextval('sec_cust.loyalty_levels_id_loyalty_seq'::regclass) | 64 |
| level | character varying(100) | NO | NULL | 100 |

### Indexes

- **loyalty_levels_pkey:** `CREATE UNIQUE INDEX loyalty_levels_pkey ON sec_cust.loyalty_levels USING btree (id_loyalty)`

---

## sec_cust.mail_logs {#seccustmaillogs}

**Type:** BASE TABLE
**Row Count:** 368
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_mail_log | bigint(64) | NO | nextval('sec_cust.mail_logs_id_mail_log_seq'::regclass) | 64 |
| url | text | YES | NULL | - |
| from_mail | text | YES | NULL | - |
| to_mail | text | YES | NULL | - |
| subject | text | YES | NULL | - |
| response | text | YES | NULL | - |
| body | json | YES | NULL | - |
| date_creation | timestamp with time zone | NO | now() | - |
| column_name | integer(32) | YES | NULL | 32 |

### Indexes

- **mail_logs_id_mail_log_key:** `CREATE UNIQUE INDEX mail_logs_id_mail_log_key ON sec_cust.mail_logs USING btree (id_mail_log)`

---

## sec_cust.ms_address {#seccustmsaddress}

**Type:** BASE TABLE
**Row Count:** 0
**Primary Keys:** id_address

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_address | bigint(64) | NO | nextval('sec_cust.ms_address_id_address_seq'::regclass) | 64 |
| full_address | text | NO | NULL | - |
| active | boolean | NO | NULL | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |
| uuid_user | uuid | NO | NULL | - |

### Foreign Keys

| Column | References |
|--------|------------|
| uuid_user | sec_cust.ms_sixmap_users.uuid_user |

### Indexes

- **ms_address_pkey:** `CREATE UNIQUE INDEX ms_address_pkey ON sec_cust.ms_address USING btree (id_address)`

---

## sec_cust.ms_allied_banks {#seccustmsalliedbanks}

**Type:** BASE TABLE
**Row Count:** 4
**Primary Keys:** id_allied_bank

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_allied_bank | bigint(64) | NO | nextval('sec_cust.ms_allied_banks_id_allied_bank_seq'::regclass) | 64 |
| first_id_bank | bigint(64) | YES | NULL | 64 |
| second_id_bank | bigint(64) | YES | NULL | 64 |

### Foreign Keys

| Column | References |
|--------|------------|
| first_id_bank | sec_cust.ms_banks.id_bank |
| second_id_bank | sec_cust.ms_banks.id_bank |

### Indexes

- **ms_allied_banks_pkey:** `CREATE UNIQUE INDEX ms_allied_banks_pkey ON sec_cust.ms_allied_banks USING btree (id_allied_bank)`

---

## sec_cust.ms_balances {#seccustmsbalances}

**Type:** BASE TABLE
**Row Count:** 0
**Primary Keys:** id_balance

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_balance | bigint(64) | NO | nextval('sec_cust.ms_balances_id_balance_seq'::regclass) | 64 |
| amount | double precision(53) | NO | NULL | 53 |
| id_reversed_balance | integer(32) | YES | NULL | 32 |
| id_currency | integer(32) | NO | NULL | 32 |
| id_wallet | integer(32) | YES | NULL | 32 |
| email_user | character varying | YES | NULL | - |
| emp_username | character varying | YES | NULL | - |
| trans_type | character varying | YES | NULL | - |
| trans_date | bigint(64) | YES | NULL | 64 |
| trans_description | text | NO | NULL | - |
| trans_comment | text | YES | NULL | - |
| id_operation | character varying | YES | NULL | - |
| operation_type | character varying | YES | NULL | - |
| wholesale_partner_balance | boolean | NO | NULL | - |
| active | boolean | NO | true | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |

### Foreign Keys

| Column | References |
|--------|------------|
| email_user | sec_cust.ms_sixmap_users.email_user |
| id_currency | sec_cust.ms_currencies.id_currency |
| id_reversed_balance | sec_cust.ms_balances.id_balance |
| id_wallet | sec_cust.ms_wallets.id_wallet |

### Indexes

- **ms_balances_pkey:** `CREATE UNIQUE INDEX ms_balances_pkey ON sec_cust.ms_balances USING btree (id_balance)`

---

## sec_cust.ms_bank_accounts {#seccustmsbankaccounts}

**Type:** BASE TABLE
**Row Count:** 61
**Primary Keys:** id_bank_account

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_bank_account | integer(32) | NO | nextval('sec_cust.ms_bank_accounts_id_bank_account_seq'::regclass) | 32 |
| id_bank | integer(32) | YES | NULL | 32 |
| id_pay_method | integer(32) | YES | NULL | 32 |
| id_currency | integer(32) | YES | NULL | 32 |
| account_holder_type | character varying(20) | NO | NULL | 20 |
| account_holder_name | character varying(100) | NO | NULL | 100 |
| account_type | character varying(20) | YES | NULL | 20 |
| account_number | character varying(200) | NO | NULL | 200 |
| account_holder_id_doc | character varying(50) | YES | NULL | 50 |
| active | boolean | NO | true | - |
| status | boolean | YES | true | - |
| public | boolean | NO | true | - |
| op_use | boolean | NO | true | - |

### Foreign Keys

| Column | References |
|--------|------------|
| id_bank | sec_cust.ms_banks.id_bank |
| id_currency | sec_cust.ms_currencies.id_currency |
| id_pay_method | sec_cust.ms_pay_methods.id_pay_method |

### Indexes

- **ms_bank_accounts_pkey:** `CREATE UNIQUE INDEX ms_bank_accounts_pkey ON sec_cust.ms_bank_accounts USING btree (id_bank_account)`

---

## sec_cust.ms_bank_fees {#seccustmsbankfees}

**Type:** BASE TABLE
**Row Count:** 1.803
**Primary Keys:** id_bank_fee

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_bank_fee | bigint(64) | NO | nextval('sec_cust.ms_bank_fees_id_bank_fee_seq'::regclass) | 64 |
| id_country | bigint(64) | YES | NULL | 64 |
| id_bank | bigint(64) | YES | NULL | 64 |
| id_pay_method | bigint(64) | YES | NULL | 64 |
| transfer_type | character varying | YES | NULL | - |
| amount_fee | double precision(53) | YES | NULL | 53 |
| percent_fee | double precision(53) | YES | NULL | 53 |

### Foreign Keys

| Column | References |
|--------|------------|
| id_bank | sec_cust.ms_banks.id_bank |
| id_pay_method | sec_cust.ms_pay_methods.id_pay_method |

### Indexes

- **ms_bank_fees_pkey:** `CREATE UNIQUE INDEX ms_bank_fees_pkey ON sec_cust.ms_bank_fees USING btree (id_bank_fee)`

---

## sec_cust.ms_banks {#seccustmsbanks}

**Type:** BASE TABLE
**Row Count:** 553
**Primary Keys:** id_bank

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_bank | integer(32) | NO | nextval('sec_cust.ms_banks_id_bank_seq'::regclass) | 32 |
| name | character varying(100) | NO | NULL | 100 |
| ident_name | character varying(100) | YES | NULL | 100 |
| ident_code | character varying | YES | NULL | - |
| id_country | integer(32) | NO | NULL | 32 |
| active | boolean | NO | true | - |

### Indexes

- **ms_banks_pkey:** `CREATE UNIQUE INDEX ms_banks_pkey ON sec_cust.ms_banks USING btree (id_bank)`

---

## sec_cust.ms_category {#seccustmscategory}

**Type:** BASE TABLE
**Row Count:** 1
**Primary Keys:** id_category

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_category | integer(32) | NO | nextval('sec_cust.ms_category_id_category_seq'::regclass) | 32 |
| name | character varying | NO | NULL | - |
| value | character varying | NO | NULL | - |

### Indexes

- **ms_category_pkey:** `CREATE UNIQUE INDEX ms_category_pkey ON sec_cust.ms_category USING btree (id_category)`

---

## sec_cust.ms_cod_users_ranks {#seccustmscodusersranks}

**Type:** BASE TABLE
**Row Count:** 0
**Primary Keys:** id_user_rank

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_user_rank | bigint(64) | NO | nextval('sec_cust.ms_cod_users_ranks_id_user_rank_seq'::regclass) | 64 |
| tx_rank | integer(32) | NO | NULL | 32 |
| cod_rank | text | NO | NULL | - |
| active | boolean | NO | NULL | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |
| id_service | integer(32) | NO | NULL | 32 |
| id_services_utype | integer(32) | NO | NULL | 32 |
| uuid_user | uuid | NO | NULL | - |

### Foreign Keys

| Column | References |
|--------|------------|
| id_service | sec_cust.ms_sixmap_services.id_service |
| id_services_utype | sec_cust.ms_sixmap_services_utype.id_services_utype |
| uuid_user | sec_cust.ms_sixmap_users.uuid_user |

### Indexes

- **ms_cod_users_ranks_pkey:** `CREATE UNIQUE INDEX ms_cod_users_ranks_pkey ON sec_cust.ms_cod_users_ranks USING btree (id_user_rank)`

---

## sec_cust.ms_cr_manual_rate {#seccustmscrmanualrate}

**Type:** BASE TABLE
**Row Count:** 5.614
**Primary Keys:** id_manual_rate

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_manual_rate | integer(32) | NO | nextval('sec_cust.ms_cr_manual_rate_id_manual_rate_seq'::regclass) | 32 |
| rate_factor | double precision(53) | NO | NULL | 53 |
| rate_cost | double precision(53) | YES | NULL | 53 |
| margin | double precision(53) | YES | NULL | 53 |
| id_origin_country | integer(32) | NO | NULL | 32 |
| id_origin_currency | integer(32) | NO | NULL | 32 |
| id_destiny_country | integer(32) | NO | NULL | 32 |
| id_destiny_currency | integer(32) | NO | NULL | 32 |
| amount_limit | double precision(53) | YES | NULL | 53 |
| amount_days_limit | integer(32) | YES | NULL | 32 |
| operation | character(3) | NO | NULL | 3 |
| id_rate_type | integer(32) | NO | NULL | 32 |
| with_margins | boolean | NO | NULL | - |
| active | boolean | NO | true | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_cost_modif | timestamp with time zone | YES | NULL | - |
| date_last_modif | timestamp with time zone | NO | now() | - |

### Foreign Keys

| Column | References |
|--------|------------|
| id_destiny_currency | sec_cust.ms_currencies.id_currency |
| id_origin_currency | sec_cust.ms_currencies.id_currency |
| id_rate_type | sec_cust.ms_cr_rate_type.id_rate_type |

### Indexes

- **ms_cr_manual_rate_pkey:** `CREATE UNIQUE INDEX ms_cr_manual_rate_pkey ON sec_cust.ms_cr_manual_rate USING btree (id_manual_rate)`
- **i_ms_cr_manual_rates:** `CREATE INDEX i_ms_cr_manual_rates ON sec_cust.ms_cr_manual_rate USING btree (id_manual_rate, operation, rate_factor, id_origin_country, id_destiny_country, id_origin_currency, id_destiny_currency, id_rate_type)`

---

## sec_cust.ms_cr_rate {#seccustmscrrate}

**Type:** BASE TABLE
**Row Count:** 27
**Primary Keys:** id_rate

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_rate | integer(32) | NO | nextval('sec_cust.ms_cr_rate_id_rate_seq'::regclass) | 32 |
| rate_factor | double precision(53) | NO | NULL | 53 |
| id_origin_country | integer(32) | NO | NULL | 32 |
| id_currency_origin | integer(32) | NO | NULL | 32 |
| id_destiny_country | integer(32) | NO | NULL | 32 |
| id_currency_destiny | integer(32) | NO | NULL | 32 |
| operation | character(3) | NO | NULL | 3 |
| id_rate_type | integer(32) | NO | NULL | 32 |
| active | boolean | NO | true | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |

### Foreign Keys

| Column | References |
|--------|------------|
| id_currency_destiny | sec_cust.ms_currencies.id_currency |
| id_currency_origin | sec_cust.ms_currencies.id_currency |
| id_rate_type | sec_cust.ms_cr_rate_type.id_rate_type |

### Indexes

- **ms_cr_rate_pkey:** `CREATE UNIQUE INDEX ms_cr_rate_pkey ON sec_cust.ms_cr_rate USING btree (id_rate)`

---

## sec_cust.ms_cr_rate_type {#seccustmscrratetype}

**Type:** BASE TABLE
**Row Count:** 8
**Primary Keys:** id_rate_type

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_rate_type | integer(32) | NO | nextval('sec_cust.ms_cr_rate_type_id_rate_type_seq'::regclass) | 32 |
| rate_type_name | character varying(50) | NO | NULL | 50 |

### Indexes

- **ms_cr_rate_type_pkey:** `CREATE UNIQUE INDEX ms_cr_rate_type_pkey ON sec_cust.ms_cr_rate_type USING btree (id_rate_type)`

---

## sec_cust.ms_cr_special_rate {#seccustmscrspecialrate}

**Type:** BASE TABLE
**Row Count:** 0
**Primary Keys:** id_special_rate

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_special_rate | integer(32) | NO | nextval('sec_cust.ms_cr_special_rate_id_special_rate_seq'::regclass) | 32 |
| special_rate_name | text | NO | NULL | - |
| rate_factor | double precision(53) | NO | NULL | 53 |
| operation | character(3) | NO | NULL | 3 |
| id_origin_country | integer(32) | NO | NULL | 32 |
| id_origin_currency | integer(32) | NO | NULL | 32 |
| id_destiny_country | integer(32) | NO | NULL | 32 |
| id_destiny_currency | integer(32) | NO | NULL | 32 |
| amount_limit | double precision(53) | YES | NULL | 53 |
| amount_days_limit | integer(32) | YES | NULL | 32 |
| transaction_limit | integer(32) | YES | NULL | 32 |
| transaction_days_limit | integer(32) | YES | NULL | 32 |
| from_date | bigint(64) | YES | NULL | 64 |
| to_date | bigint(64) | YES | NULL | 64 |
| icon_name | character varying | NO | NULL | - |
| active | boolean | NO | true | - |
| is_published | boolean | NO | NULL | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |

### Foreign Keys

| Column | References |
|--------|------------|
| id_destiny_currency | sec_cust.ms_currencies.id_currency |
| id_origin_currency | sec_cust.ms_currencies.id_currency |

### Indexes

- **ms_cr_special_rate_pkey:** `CREATE UNIQUE INDEX ms_cr_special_rate_pkey ON sec_cust.ms_cr_special_rate USING btree (id_special_rate)`

---

## sec_cust.ms_cr_vip_rate {#seccustmscrviprate}

**Type:** BASE TABLE
**Row Count:** 0
**Primary Keys:** id_vip_rate

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_vip_rate | integer(32) | NO | nextval('sec_cust.ms_cr_vip_rate_id_vip_rate_seq'::regclass) | 32 |
| rate_factor | double precision(53) | NO | NULL | 53 |
| operation | character(3) | NO | NULL | 3 |
| email_user | character varying | NO | NULL | - |
| id_origin_country | integer(32) | NO | NULL | 32 |
| id_origin_currency | integer(32) | NO | NULL | 32 |
| id_destiny_country | integer(32) | NO | NULL | 32 |
| id_destiny_currency | integer(32) | NO | NULL | 32 |
| from_date | bigint(64) | YES | NULL | 64 |
| to_date | bigint(64) | YES | NULL | 64 |
| active | boolean | NO | true | - |
| is_published | boolean | NO | NULL | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |

### Foreign Keys

| Column | References |
|--------|------------|
| email_user | sec_cust.ms_sixmap_users.email_user |
| id_destiny_currency | sec_cust.ms_currencies.id_currency |
| id_origin_currency | sec_cust.ms_currencies.id_currency |

### Indexes

- **ms_cr_vip_rate_pkey:** `CREATE UNIQUE INDEX ms_cr_vip_rate_pkey ON sec_cust.ms_cr_vip_rate USING btree (id_vip_rate)`

---

## sec_cust.ms_currencies {#seccustmscurrencies}

**Type:** BASE TABLE
**Row Count:** 12
**Primary Keys:** id_currency

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_currency | integer(32) | NO | nextval('sec_cust.ms_currencies_id_currency_seq'::regclass) | 32 |
| name | character varying(50) | NO | NULL | 50 |
| currency_abrev | character varying(10) | YES | NULL | 10 |
| type | character varying(6) | NO | NULL | 6 |
| iso_cod | character varying(5) | NO | NULL | 5 |
| id_country | integer(32) | YES | NULL | 32 |
| active | boolean | NO | true | - |
| origin_currency | boolean | NO | true | - |
| destiny_currency | boolean | NO | true | - |
| decimals_quant | integer(32) | NO | NULL | 32 |

### Indexes

- **ms_currencies_pkey:** `CREATE UNIQUE INDEX ms_currencies_pkey ON sec_cust.ms_currencies USING btree (id_currency)`
- **ms_currencies_iso_cod_key:** `CREATE UNIQUE INDEX ms_currencies_iso_cod_key ON sec_cust.ms_currencies USING btree (iso_cod)`

---

## sec_cust.ms_departments {#seccustmsdepartments}

**Type:** BASE TABLE
**Row Count:** 11
**Primary Keys:** id_dpt

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_dpt | bigint(64) | NO | nextval('sec_cust.ms_departments_id_dpt_seq'::regclass) | 64 |
| name_dpt | text | NO | NULL | - |
| active | boolean | NO | NULL | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |

### Indexes

- **ms_departments_pkey:** `CREATE UNIQUE INDEX ms_departments_pkey ON sec_cust.ms_departments USING btree (id_dpt)`

---

## sec_cust.ms_doc_type {#seccustmsdoctype}

**Type:** BASE TABLE
**Row Count:** 782
**Primary Keys:** id_ident_doc_type

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_ident_doc_type | bigint(64) | NO | nextval('sec_cust.ms_doc_type_id_ident_doc_type_seq'::regclass) | 64 |
| acronym | character varying(50) | NO | NULL | 50 |
| name_doc_type | character varying(50) | NO | NULL | 50 |
| type_doc_type | character varying(50) | YES | NULL | 50 |
| active | boolean | NO | NULL | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |
| id_resid_country | integer(32) | YES | NULL | 32 |
| id_ip_country | integer(32) | YES | NULL | 32 |
| id_service | integer(32) | YES | NULL | 32 |
| name_country | character varying(50) | YES | NULL | 50 |
| person_type | character varying | YES | NULL | - |
| payment_doc | boolean | NO | false | - |
| signup_doc | boolean | NO | false | - |

### Foreign Keys

| Column | References |
|--------|------------|
| id_service | sec_cust.ms_sixmap_services.id_service |

### Indexes

- **ms_doc_type_pkey:** `CREATE UNIQUE INDEX ms_doc_type_pkey ON sec_cust.ms_doc_type USING btree (id_ident_doc_type)`

---

## sec_cust.ms_fiat_rates {#seccustmsfiatrates}

**Type:** BASE TABLE
**Row Count:** 0
**Primary Keys:** id_fiat_rate

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_fiat_rate | integer(32) | NO | nextval('sec_cust.ms_fiat_rates_id_fiat_rate_seq'::regclass) | 32 |
| id_currency_origin | integer(32) | NO | NULL | 32 |
| id_currency_destiny | integer(32) | NO | NULL | 32 |
| rate_value | double precision(53) | NO | NULL | 53 |

### Foreign Keys

| Column | References |
|--------|------------|
| id_currency_destiny | sec_cust.ms_currencies.id_currency |
| id_currency_origin | sec_cust.ms_currencies.id_currency |

### Indexes

- **ms_fiat_rates_pkey:** `CREATE UNIQUE INDEX ms_fiat_rates_pkey ON sec_cust.ms_fiat_rates USING btree (id_fiat_rate)`

---

## sec_cust.ms_fields {#seccustmsfields}

**Type:** BASE TABLE
**Row Count:** 61
**Primary Keys:** id_field

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_field | integer(32) | NO | nextval('sec_cust.ms_fields_id_field_seq'::regclass) | 32 |
| name_field | character varying(30) | NO | NULL | 30 |
| id_notification | integer(32) | YES | NULL | 32 |
| id_pay_method | integer(32) | YES | NULL | 32 |
| is_optional | boolean | NO | NULL | - |
| active | boolean | NO | true | - |

### Foreign Keys

| Column | References |
|--------|------------|
| id_notification | sec_cust.ms_user_notification_types.id_notification |
| id_pay_method | sec_cust.ms_pay_methods.id_pay_method |

### Indexes

- **ms_fields_pkey:** `CREATE UNIQUE INDEX ms_fields_pkey ON sec_cust.ms_fields USING btree (id_field)`

---

## sec_cust.ms_global_notifications {#seccustmsglobalnotifications}

**Type:** BASE TABLE
**Row Count:** 20
**Primary Keys:** id_global_notification

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_global_notification | bigint(64) | NO | nextval('sec_cust.ms_global_notifications_id_global_notification_seq'::regclass) | 64 |
| title | text | YES | NULL | - |
| msg | text | YES | NULL | - |
| type | text | NO | NULL | - |
| id_country | bigint(64) | YES | NULL | 64 |
| id_verif_level | bigint(64) | YES | NULL | 64 |
| non_deletable | boolean | NO | false | - |
| is_published | boolean | NO | true | - |
| active | boolean | NO | true | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |

### Foreign Keys

| Column | References |
|--------|------------|
| id_verif_level | sec_cust.ms_verifications.id_verification |

### Indexes

- **ms_global_notifications_pkey:** `CREATE UNIQUE INDEX ms_global_notifications_pkey ON sec_cust.ms_global_notifications USING btree (id_global_notification)`

---

## sec_cust.ms_item {#seccustmsitem}

**Type:** BASE TABLE
**Row Count:** 2
**Primary Keys:** id_item

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_item | integer(32) | NO | nextval('sec_cust.ms_item_id_item_seq'::regclass) | 32 |
| name | character varying | NO | NULL | - |
| description | character varying | YES | NULL | - |
| id_category | integer(32) | NO | NULL | 32 |

### Foreign Keys

| Column | References |
|--------|------------|
| id_category | sec_cust.ms_category.id_category |

### Indexes

- **ms_item_pkey:** `CREATE UNIQUE INDEX ms_item_pkey ON sec_cust.ms_item USING btree (id_item)`

---

## sec_cust.ms_level_answers {#seccustmslevelanswers}

**Type:** BASE TABLE
**Row Count:** 80
**Primary Keys:** id_level_answer

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_level_answer | bigint(64) | NO | nextval('sec_cust.ms_level_answers_id_level_answer_seq'::regclass) | 64 |
| level | integer(32) | NO | NULL | 32 |
| answer | text | NO | NULL | - |
| id_level_question | integer(32) | NO | NULL | 32 |
| active | boolean | NO | NULL | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |
| alert | boolean | YES | NULL | - |
| id_resid_country | integer(32) | YES | NULL | 32 |

### Foreign Keys

| Column | References |
|--------|------------|
| id_level_question | sec_cust.ms_level_questions.id_level_question |

### Indexes

- **ms_level_answers_pkey:** `CREATE UNIQUE INDEX ms_level_answers_pkey ON sec_cust.ms_level_answers USING btree (id_level_answer)`

---

## sec_cust.ms_level_questions {#seccustmslevelquestions}

**Type:** BASE TABLE
**Row Count:** 4
**Primary Keys:** id_level_question

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_level_question | bigint(64) | NO | nextval('sec_cust.ms_level_questions_id_level_question_seq'::regclass) | 64 |
| level | integer(32) | NO | NULL | 32 |
| question_number | integer(32) | NO | NULL | 32 |
| question | text | NO | NULL | - |
| question_type | character varying | NO | NULL | - |
| active | boolean | NO | NULL | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |

### Indexes

- **ms_level_questions_pkey:** `CREATE UNIQUE INDEX ms_level_questions_pkey ON sec_cust.ms_level_questions USING btree (id_level_question)`

---

## sec_cust.ms_limit_routes {#seccustmslimitroutes}

**Type:** BASE TABLE
**Row Count:** 2
**Primary Keys:** id_limit_route

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_limit_route | bigint(64) | NO | nextval('sec_cust.ms_limit_routes_id_limit_route_seq'::regclass) | 64 |
| route | character varying | YES | NULL | - |
| attempts_limit | integer(32) | YES | NULL | 32 |
| time_limit | integer(32) | YES | NULL | 32 |

### Indexes

- **ms_limit_routes_pkey:** `CREATE UNIQUE INDEX ms_limit_routes_pkey ON sec_cust.ms_limit_routes USING btree (id_limit_route)`

---

## sec_cust.ms_limit_routes_by_ip {#seccustmslimitroutesbyip}

**Type:** BASE TABLE
**Row Count:** 119
**Primary Keys:** id_limit_route_ip

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_limit_route_ip | bigint(64) | NO | nextval('sec_cust.ms_limit_routes_by_ip_id_limit_route_ip_seq'::regclass) | 64 |
| ip | character varying | YES | NULL | - |
| id_limit_route | bigint(64) | YES | NULL | 64 |
| attempts | integer(32) | YES | NULL | 32 |
| last_attempt | timestamp with time zone | YES | NULL | - |

### Foreign Keys

| Column | References |
|--------|------------|
| id_limit_route | sec_cust.ms_limit_routes.id_limit_route |

### Indexes

- **ms_limit_routes_by_ip_pkey:** `CREATE UNIQUE INDEX ms_limit_routes_by_ip_pkey ON sec_cust.ms_limit_routes_by_ip USING btree (id_limit_route_ip)`

---

## sec_cust.ms_limitations {#seccustmslimitations}

**Type:** BASE TABLE
**Row Count:** 6
**Primary Keys:** id_limitation

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_limitation | bigint(64) | NO | nextval('sec_cust.ms_limitations_id_limitation_seq'::regclass) | 64 |
| name | character varying | NO | NULL | - |
| ident_name | character varying | NO | NULL | - |
| active | boolean | NO | NULL | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |

### Indexes

- **ms_limitations_pkey:** `CREATE UNIQUE INDEX ms_limitations_pkey ON sec_cust.ms_limitations USING btree (id_limitation)`
- **ms_limitations_ident_name_key:** `CREATE UNIQUE INDEX ms_limitations_ident_name_key ON sec_cust.ms_limitations USING btree (ident_name)`

---

## sec_cust.ms_mail {#seccustmsmail}

**Type:** BASE TABLE
**Row Count:** 0
**Primary Keys:** id_mail

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_mail | bigint(64) | NO | nextval('sec_cust.ms_mail_id_mail_seq'::regclass) | 64 |
| name | character varying(255) | NO | NULL | 255 |
| description | text | NO | NULL | - |
| active | boolean | NO | NULL | - |

### Indexes

- **ms_mail_pkey:** `CREATE UNIQUE INDEX ms_mail_pkey ON sec_cust.ms_mail USING btree (id_mail)`

---

## sec_cust.ms_migration_status {#seccustmsmigrationstatus}

**Type:** BASE TABLE
**Row Count:** 4
**Primary Keys:** id_migration_status

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_migration_status | bigint(64) | NO | nextval('sec_cust.ms_migration_status_id_migration_status_seq'::regclass) | 64 |
| name_migration_status | text | NO | NULL | - |
| active | boolean | NO | NULL | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |

### Indexes

- **ms_migration_status_pkey:** `CREATE UNIQUE INDEX ms_migration_status_pkey ON sec_cust.ms_migration_status USING btree (id_migration_status)`

---

## sec_cust.ms_notifications {#seccustmsnotifications}

**Type:** BASE TABLE
**Row Count:** 5.138
**Primary Keys:** id_notification

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_notification | bigint(64) | NO | nextval('sec_cust.ms_notifications_id_notification_seq'::regclass) | 64 |
| email_user | character varying | YES | NULL | - |
| final_text | text | NO | NULL | - |
| notification_date | timestamp with time zone | YES | NULL | - |
| id_global_notification | bigint(64) | YES | NULL | 64 |
| is_read | boolean | YES | NULL | - |
| active | boolean | NO | NULL | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |

### Foreign Keys

| Column | References |
|--------|------------|
| email_user | sec_cust.ms_sixmap_users.email_user |
| id_global_notification | sec_cust.ms_global_notifications.id_global_notification |

### Indexes

- **ms_notifications_pkey:** `CREATE UNIQUE INDEX ms_notifications_pkey ON sec_cust.ms_notifications USING btree (id_notification)`

---

## sec_cust.ms_operation {#seccustmsoperation}

**Type:** BASE TABLE
**Row Count:** 0
**Primary Keys:** id_operation

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_operation | bigint(64) | NO | nextval('sec_cust.ms_operation_id_operation_seq'::regclass) | 64 |
| amount | text | NO | NULL | - |
| uuid_user | uuid | YES | NULL | - |

### Foreign Keys

| Column | References |
|--------|------------|
| uuid_user | sec_cust.ms_sixmap_users.uuid_user |

### Indexes

- **ms_operation_pkey:** `CREATE UNIQUE INDEX ms_operation_pkey ON sec_cust.ms_operation USING btree (id_operation)`

---

## sec_cust.ms_over_quota {#seccustmsoverquota}

**Type:** BASE TABLE
**Row Count:** 0
**Primary Keys:** id_over_quota

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_over_quota | bigint(64) | NO | nextval('sec_cust.ms_over_quota_id_over_quota_seq'::regclass) | 64 |
| active | boolean | NO | NULL | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |
| uuid_user | uuid | NO | NULL | - |

### Foreign Keys

| Column | References |
|--------|------------|
| uuid_user | sec_cust.ms_sixmap_users.uuid_user |

### Indexes

- **ms_over_quota_pkey:** `CREATE UNIQUE INDEX ms_over_quota_pkey ON sec_cust.ms_over_quota USING btree (id_over_quota)`

---

## sec_cust.ms_pay_methods {#seccustmspaymethods}

**Type:** BASE TABLE
**Row Count:** 27
**Primary Keys:** id_pay_method

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_pay_method | integer(32) | NO | nextval('sec_cust.ms_pay_methods_id_pay_method_seq'::regclass) | 32 |
| name | character varying(40) | NO | NULL | 40 |
| viewing_name | character varying | NO | NULL | - |
| id_country | integer(32) | NO | NULL | 32 |
| id_currency | integer(32) | NO | NULL | 32 |
| is_pay_method | boolean | NO | NULL | - |
| is_deposit_method | boolean | NO | NULL | - |
| active | boolean | NO | true | - |

### Foreign Keys

| Column | References |
|--------|------------|
| id_currency | sec_cust.ms_currencies.id_currency |

### Indexes

- **ms_pay_methods_pkey:** `CREATE UNIQUE INDEX ms_pay_methods_pkey ON sec_cust.ms_pay_methods USING btree (id_pay_method)`

---

## sec_cust.ms_phone {#seccustmsphone}

**Type:** BASE TABLE
**Row Count:** 5.054
**Primary Keys:** id_phone

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_phone | bigint(64) | NO | nextval('sec_cust.ms_phone_id_phone_seq'::regclass) | 64 |
| type | character varying(50) | NO | NULL | 50 |
| code | character varying(10) | NO | NULL | 10 |
| number | character varying | NO | NULL | - |
| full_number | character varying(20) | NO | NULL | 20 |
| mobile | boolean | NO | NULL | - |
| home | boolean | NO | NULL | - |
| office | boolean | NO | NULL | - |
| whatsapp | boolean | NO | NULL | - |
| telegram | boolean | NO | NULL | - |
| active | boolean | NO | NULL | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |
| uuid_user | uuid | NO | NULL | - |

### Foreign Keys

| Column | References |
|--------|------------|
| uuid_user | sec_cust.ms_sixmap_users.uuid_user |

### Indexes

- **ms_phone_pkey:** `CREATE UNIQUE INDEX ms_phone_pkey ON sec_cust.ms_phone USING btree (id_phone)`

---

## sec_cust.ms_pre_remittance {#seccustmspreremittance}

**Type:** BASE TABLE
**Row Count:** 214
**Primary Keys:** id_pre_remittance

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_pre_remittance | bigint(64) | NO | nextval('sec_cust.ms_pre_remittance_id_pre_remittance_seq'::regclass) | 64 |
| pre_remittance | json | YES | NULL | - |
| email_user | character varying | YES | NULL | - |
| active | boolean | NO | true | - |
| was_expired | boolean | YES | NULL | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_shown | bigint(64) | YES | NULL | 64 |
| date_last_modif | timestamp with time zone | NO | now() | - |

### Foreign Keys

| Column | References |
|--------|------------|
| email_user | sec_cust.ms_sixmap_users.email_user |

### Indexes

- **ms_pre_remittance_pkey:** `CREATE UNIQUE INDEX ms_pre_remittance_pkey ON sec_cust.ms_pre_remittance USING btree (id_pre_remittance)`

---

## sec_cust.ms_profiles {#seccustmsprofiles}

**Type:** BASE TABLE
**Row Count:** 6
**Primary Keys:** uuid_profile

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| uuid_profile | uuid | NO | uuid_generate_v4() | - |
| name_profile | character varying(20) | NO | NULL | 20 |
| active | boolean | NO | NULL | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |

### Indexes

- **ms_profiles_pkey:** `CREATE UNIQUE INDEX ms_profiles_pkey ON sec_cust.ms_profiles USING btree (uuid_profile)`

---

## sec_cust.ms_roles {#seccustmsroles}

**Type:** BASE TABLE
**Row Count:** 0
**Primary Keys:** uuid_role

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| uuid_role | uuid | NO | uuid_generate_v4() | - |
| name_role | character varying(20) | NO | NULL | 20 |
| active | boolean | NO | NULL | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |

### Indexes

- **ms_roles_pkey:** `CREATE UNIQUE INDEX ms_roles_pkey ON sec_cust.ms_roles USING btree (uuid_role)`

---

## sec_cust.ms_routes {#seccustmsroutes}

**Type:** BASE TABLE
**Row Count:** 0
**Primary Keys:** uuid_route

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| uuid_route | uuid | NO | uuid_generate_v4() | - |
| name_route | character varying(20) | NO | NULL | 20 |
| icon | character varying(20) | YES | NULL | 20 |
| url | text | NO | NULL | - |
| component | text | NO | NULL | - |
| active | boolean | NO | NULL | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |

### Indexes

- **ms_routes_pkey:** `CREATE UNIQUE INDEX ms_routes_pkey ON sec_cust.ms_routes USING btree (uuid_route)`

---

## sec_cust.ms_sixmap_services {#seccustmssixmapservices}

**Type:** BASE TABLE
**Row Count:** 1
**Primary Keys:** id_service

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_service | bigint(64) | NO | nextval('sec_cust.ms_sixmap_services_id_service_seq'::regclass) | 64 |
| tx_service | character varying(50) | NO | NULL | 50 |
| active | boolean | NO | NULL | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |

### Indexes

- **ms_sixmap_services_pkey:** `CREATE UNIQUE INDEX ms_sixmap_services_pkey ON sec_cust.ms_sixmap_services USING btree (id_service)`

---

## sec_cust.ms_sixmap_services_users_public_codes {#seccustmssixmapservicesuserspubliccodes}

**Type:** BASE TABLE
**Row Count:** 0
**Primary Keys:** id_supc

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_supc | bigint(64) | NO | nextval('sec_cust.ms_sixmap_services_users_public_codes_id_supc_seq'::regclass) | 64 |
| cust_cr_cod_pub | text | NO | NULL | - |
| active | boolean | NO | NULL | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |
| id_service | integer(32) | NO | NULL | 32 |
| uuid_user | uuid | NO | NULL | - |

### Foreign Keys

| Column | References |
|--------|------------|
| id_service | sec_cust.ms_sixmap_services.id_service |
| uuid_user | sec_cust.ms_sixmap_users.uuid_user |

### Indexes

- **ms_sixmap_services_users_public_codes_pkey:** `CREATE UNIQUE INDEX ms_sixmap_services_users_public_codes_pkey ON sec_cust.ms_sixmap_services_users_public_codes USING btree (id_supc)`

---

## sec_cust.ms_sixmap_services_utype {#seccustmssixmapservicesutype}

**Type:** BASE TABLE
**Row Count:** 3
**Primary Keys:** id_services_utype

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_services_utype | bigint(64) | NO | nextval('sec_cust.ms_sixmap_services_utype_id_services_utype_seq'::regclass) | 64 |
| name_utype | character varying(50) | NO | NULL | 50 |
| active | boolean | NO | NULL | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |
| id_service | integer(32) | NO | NULL | 32 |

### Foreign Keys

| Column | References |
|--------|------------|
| id_service | sec_cust.ms_sixmap_services.id_service |

### Indexes

- **ms_sixmap_services_utype_pkey:** `CREATE UNIQUE INDEX ms_sixmap_services_utype_pkey ON sec_cust.ms_sixmap_services_utype USING btree (id_services_utype)`

---

## sec_cust.ms_sixmap_users {#seccustmssixmapusers}

**Type:** BASE TABLE
**Row Count:** 5.061
**Primary Keys:** id_user, uuid_user

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_user | bigint(64) | NO | nextval('sec_cust.ms_sixmap_users_id_user_seq'::regclass) | 64 |
| uuid_user | uuid | NO | uuid_generate_v4() | - |
| username | character varying(100) | YES | NULL | 100 |
| email_user | character varying(100) | YES | NULL | 100 |
| password | text | NO | NULL | - |
| ops_password | text | YES | NULL | - |
| cust_cr_cod_pub | character varying | YES | NULL | - |
| cust_cr_cod_pub_leg | character varying | YES | NULL | - |
| cod_rank | character varying | YES | NULL | - |
| verif_level_apb | boolean | YES | NULL | - |
| multi_country | boolean | YES | false | - |
| last_session_reg | character varying | YES | NULL | - |
| last_ip_reg | character varying(100) | YES | NULL::character varying | 100 |
| last_ip_city_reg | character varying(100) | YES | NULL::character varying | 100 |
| last_id_log_reg | integer(32) | YES | NULL | 32 |
| date_last_conn | timestamp with time zone | NO | NULL | - |
| gender | character(1) | YES | NULL | 1 |
| date_birth | timestamp with time zone | YES | NULL | - |
| ident_doc_number | character varying(30) | YES | NULL | 30 |
| main_phone | character varying(30) | YES | NULL | 30 |
| second_phone | character varying(30) | YES | NULL | 30 |
| delegated_phone | character varying(30) | YES | NULL | 30 |
| resid_city | text | YES | NULL | - |
| address | text | YES | NULL | - |
| state_name | text | YES | NULL | - |
| referral_node | text | YES | NULL | - |
| main_sn_platf | text | YES | NULL | - |
| user_main_sn_platf | text | YES | NULL | - |
| occupation | text | YES | NULL | - |
| ok_legal_terms | boolean | YES | NULL | - |
| pol_exp_per | boolean | YES | false | - |
| date_legacy_reg | timestamp with time zone | YES | NULL | - |
| user_active | boolean | NO | NULL | - |
| user_blocked | boolean | NO | NULL | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |
| user_reg_finished | boolean | YES | false | - |
| login_attempts | integer(32) | YES | 0 | 32 |
| last_login_attempt | timestamp with time zone | YES | NULL | - |
| uuid_profile | uuid | YES | NULL | - |
| id_user_priv | integer(32) | NO | NULL | 32 |
| id_service | integer(32) | YES | NULL | 32 |
| id_services_utype | integer(32) | YES | NULL | 32 |
| id_ident_doc_type | integer(32) | YES | NULL | 32 |
| id_resid_country | integer(32) | NO | NULL | 32 |
| id_nationality_country | integer(32) | YES | NULL | 32 |
| id_verif_level | integer(32) | YES | NULL | 32 |
| id_wholesale_partner | integer(32) | YES | NULL | 32 |
| truthful_information | boolean | YES | NULL | - |
| lawful_funds | boolean | YES | NULL | - |
| id_migrated | bigint(64) | YES | NULL | 64 |
| country_exception | boolean | YES | NULL | - |
| phone_exception | boolean | YES | NULL | - |
| limit_exception | boolean | YES | NULL | - |
| multi_currency_exception | boolean | YES | NULL | - |
| completed_information_migrated | boolean | YES | NULL | - |
| phone_changed | boolean | NO | false | - |
| mock_data | boolean | NO | false | - |

### Foreign Keys

| Column | References |
|--------|------------|
| id_wholesale_partner | sec_cust.ms_sixmap_users.id_user |
| id_ident_doc_type | sec_cust.ms_doc_type.id_ident_doc_type |
| uuid_profile | sec_cust.ms_profiles.uuid_profile |
| id_service | sec_cust.ms_sixmap_services.id_service |
| id_services_utype | sec_cust.ms_sixmap_services_utype.id_services_utype |

### Indexes

- **ms_sixmap_users_pkey:** `CREATE UNIQUE INDEX ms_sixmap_users_pkey ON sec_cust.ms_sixmap_users USING btree (id_user, uuid_user)`
- **ms_sixmap_users_id_user_key:** `CREATE UNIQUE INDEX ms_sixmap_users_id_user_key ON sec_cust.ms_sixmap_users USING btree (id_user)`
- **ms_sixmap_users_uuid_user_key:** `CREATE UNIQUE INDEX ms_sixmap_users_uuid_user_key ON sec_cust.ms_sixmap_users USING btree (uuid_user)`
- **ms_sixmap_users_email_user_key:** `CREATE UNIQUE INDEX ms_sixmap_users_email_user_key ON sec_cust.ms_sixmap_users USING btree (email_user)`
- **i_ms_sixmap_users_cust:** `CREATE INDEX i_ms_sixmap_users_cust ON sec_cust.ms_sixmap_users USING btree (id_user, cust_cr_cod_pub, ident_doc_number, email_user, uuid_user, phone_exception, country_exception, limit_exception, multi_currency_exception, id_verif_level, id_nationality_country)`

---

## sec_cust.ms_suspicious_activities {#seccustmssuspiciousactivities}

**Type:** BASE TABLE
**Row Count:** 0
**Primary Keys:** id_suspicious_activity

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_suspicious_activity | bigint(64) | NO | nextval('sec_cust.ms_suspicious_activities_id_suspicious_activity_seq'::regclass) | 64 |
| activity | text | NO | NULL | - |
| uuid_user | uuid | YES | NULL | - |

### Foreign Keys

| Column | References |
|--------|------------|
| uuid_user | sec_cust.ms_sixmap_users.uuid_user |

### Indexes

- **ms_suspicious_activities_pkey:** `CREATE UNIQUE INDEX ms_suspicious_activities_pkey ON sec_cust.ms_suspicious_activities USING btree (id_suspicious_activity)`

---

## sec_cust.ms_temp_codes {#seccustmstempcodes}

**Type:** BASE TABLE
**Row Count:** 118
**Primary Keys:** id_code

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_code | bigint(64) | NO | nextval('sec_cust.ms_temp_codes_id_code_seq'::regclass) | 64 |
| code | integer(32) | NO | NULL | 32 |
| date_start | timestamp with time zone | NO | now() | - |
| expire | integer(32) | NO | NULL | 32 |
| active | boolean | NO | NULL | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |
| ident_user | text | NO | NULL | - |

### Indexes

- **ms_temp_codes_pkey:** `CREATE UNIQUE INDEX ms_temp_codes_pkey ON sec_cust.ms_temp_codes USING btree (id_code)`

---

## sec_cust.ms_thirdparty_transfers {#seccustmsthirdpartytransfers}

**Type:** BASE TABLE
**Row Count:** 0
**Primary Keys:** id_thirdparty_transfer

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_thirdparty_transfer | bigint(64) | NO | nextval('sec_cust.ms_thirdparty_transfers_id_thirdparty_transfer_seq'::regclass) | 64 |
| full_name | character varying | YES | NULL | - |
| ident_doc_number | character varying | YES | NULL | - |
| account_number | character varying | YES | NULL | - |
| id_bank | bigint(64) | YES | NULL | 64 |
| id_country | bigint(64) | YES | NULL | 64 |
| id_currency | bigint(64) | YES | NULL | 64 |
| id_remittance | bigint(64) | YES | NULL | 64 |

### Indexes

- **ms_thirdparty_transfers_pkey:** `CREATE UNIQUE INDEX ms_thirdparty_transfers_pkey ON sec_cust.ms_thirdparty_transfers USING btree (id_thirdparty_transfer)`

---

## sec_cust.ms_user_accounts {#seccustmsuseraccounts}

**Type:** BASE TABLE
**Row Count:** 0
**Primary Keys:** id_user_account

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_user_account | bigint(64) | NO | nextval('sec_cust.ms_user_accounts_id_user_account_seq'::regclass) | 64 |
| owner_name | text | YES | NULL | - |
| owner_id | character varying | YES | NULL | - |
| account_id | text | YES | NULL | - |
| account_type | character varying | YES | NULL | - |
| phone_number | character varying | YES | NULL | - |
| email | character varying | YES | NULL | - |
| id_bank | integer(32) | NO | NULL | 32 |
| id_pay_method | integer(32) | NO | NULL | 32 |
| id_optional_field | bigint(64) | YES | NULL | 64 |
| id_user | integer(32) | NO | NULL | 32 |
| id_doc_type | integer(32) | YES | NULL | 32 |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |
| active | boolean | NO | true | - |

### Foreign Keys

| Column | References |
|--------|------------|
| id_bank | sec_cust.ms_banks.id_bank |
| id_doc_type | sec_cust.ms_doc_type.id_ident_doc_type |
| id_optional_field | sec_cust.ms_fields.id_field |
| id_pay_method | sec_cust.ms_pay_methods.id_pay_method |
| id_user | sec_cust.ms_sixmap_users.id_user |

### Indexes

- **ms_user_accounts_pkey:** `CREATE UNIQUE INDEX ms_user_accounts_pkey ON sec_cust.ms_user_accounts USING btree (id_user_account)`

---

## sec_cust.ms_user_notification_types {#seccustmsusernotificationtypes}

**Type:** BASE TABLE
**Row Count:** 3
**Primary Keys:** id_notification

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_notification | integer(32) | NO | nextval('sec_cust.ms_user_notification_types_id_notification_seq'::regclass) | 32 |
| type_name | character varying(10) | NO | NULL | 10 |
| active | boolean | NO | true | - |

### Indexes

- **ms_user_notification_types_pkey:** `CREATE UNIQUE INDEX ms_user_notification_types_pkey ON sec_cust.ms_user_notification_types USING btree (id_notification)`

---

## sec_cust.ms_users_archives_status {#seccustmsusersarchivesstatus}

**Type:** BASE TABLE
**Row Count:** 0
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_user | bigint(64) | YES | NULL | 64 |
| cr_id | character varying | YES | NULL | - |
| downloaded_doc | boolean | YES | false | - |
| downloaded_selfie | boolean | YES | false | - |

---

## sec_cust.ms_verif_level {#seccustmsveriflevel}

**Type:** BASE TABLE
**Row Count:** 247
**Primary Keys:** id_verif_level

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_verif_level | bigint(64) | NO | nextval('sec_cust.ms_verif_level_id_verif_level_seq'::regclass) | 64 |
| id_vl | integer(32) | NO | NULL | 32 |
| req_type | character varying(50) | NO | NULL | 50 |
| req_type_value | character varying(50) | NO | NULL | 50 |
| req_use_path | character varying(50) | NO | NULL | 50 |
| req_confirm_action | boolean | YES | NULL | - |
| active | boolean | NO | NULL | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |
| id_service | integer(32) | NO | NULL | 32 |
| id_services_utype | integer(32) | NO | NULL | 32 |
| id_resid_country | integer(32) | NO | NULL | 32 |

### Foreign Keys

| Column | References |
|--------|------------|
| id_service | sec_cust.ms_sixmap_services.id_service |
| id_services_utype | sec_cust.ms_sixmap_services_utype.id_services_utype |
| id_vl | sec_cust.ms_verifications.id_verification |

### Indexes

- **ms_verif_level_pkey:** `CREATE UNIQUE INDEX ms_verif_level_pkey ON sec_cust.ms_verif_level USING btree (id_verif_level)`

---

## sec_cust.ms_verifications {#seccustmsverifications}

**Type:** BASE TABLE
**Row Count:** 3
**Primary Keys:** id_verification

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_verification | integer(32) | NO | NULL | 32 |
| name_verification | text | NO | NULL | - |
| active | boolean | NO | NULL | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |

### Indexes

- **ms_verifications_pkey:** `CREATE UNIQUE INDEX ms_verifications_pkey ON sec_cust.ms_verifications USING btree (id_verification)`

---

## sec_cust.ms_wallets {#seccustmswallets}

**Type:** BASE TABLE
**Row Count:** 32
**Primary Keys:** id_wallet

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_wallet | bigint(64) | NO | nextval('sec_cust.ms_wallets_id_wallet_seq'::regclass) | 64 |
| number | text | YES | NULL | - |
| holder | text | YES | NULL | - |
| is_main | boolean | NO | false | - |
| id_network | integer(32) | YES | NULL | 32 |
| id_user | integer(32) | YES | NULL | 32 |
| id_exchange | integer(32) | YES | NULL | 32 |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |
| active | boolean | NO | true | - |

### Foreign Keys

| Column | References |
|--------|------------|
| id_user | sec_cust.ms_sixmap_users.id_user |

### Indexes

- **ms_wallets_pkey:** `CREATE UNIQUE INDEX ms_wallets_pkey ON sec_cust.ms_wallets USING btree (id_wallet)`

---

## sec_cust.ms_wholesale_partners {#seccustmswholesalepartners}

**Type:** BASE TABLE
**Row Count:** 0
**Primary Keys:** id_partner

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_partner | bigint(64) | NO | nextval('sec_cust.ms_wholesale_partners_id_partner_seq'::regclass) | 64 |
| apb_ok | boolean | YES | NULL | - |
| active | boolean | NO | NULL | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |
| email_user | character varying | NO | NULL | - |

### Foreign Keys

| Column | References |
|--------|------------|
| email_user | sec_cust.ms_sixmap_users.email_user |

### Indexes

- **ms_wholesale_partners_pkey:** `CREATE UNIQUE INDEX ms_wholesale_partners_pkey ON sec_cust.ms_wholesale_partners USING btree (id_partner)`

---

## sec_cust.ms_wholesale_partners_config {#seccustmswholesalepartnersconfig}

**Type:** BASE TABLE
**Row Count:** 1
**Primary Keys:** id_wholesale_partners_config

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_wholesale_partners_config | bigint(64) | NO | nextval('sec_cust.ms_wholesale_partners_config_id_wholesale_partners_config_seq'::regclass) | 64 |
| profit_limit | double precision(53) | YES | NULL | 53 |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |

### Indexes

- **ms_wholesale_partners_config_pkey:** `CREATE UNIQUE INDEX ms_wholesale_partners_config_pkey ON sec_cust.ms_wholesale_partners_config USING btree (id_wholesale_partners_config)`

---

## sec_cust.ms_wholesale_partners_info {#seccustmswholesalepartnersinfo}

**Type:** BASE TABLE
**Row Count:** 0
**Primary Keys:** id_wholesale_partners_info

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_wholesale_partners_info | bigint(64) | NO | nextval('sec_cust.ms_wholesale_partners_info_id_wholesale_partners_info_seq'::regclass) | 64 |
| name | character varying | YES | NULL | - |
| slug | character varying | YES | NULL | - |
| logo | text | YES | NULL | - |
| theme | character varying | YES | NULL | - |
| percent_profit | double precision(53) | YES | NULL | 53 |
| email_user | character varying | YES | NULL | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |

### Foreign Keys

| Column | References |
|--------|------------|
| email_user | sec_cust.ms_sixmap_users.email_user |

### Indexes

- **ms_wholesale_partners_info_pkey:** `CREATE UNIQUE INDEX ms_wholesale_partners_info_pkey ON sec_cust.ms_wholesale_partners_info USING btree (id_wholesale_partners_info)`
- **ms_wholesale_partners_info_name_key:** `CREATE UNIQUE INDEX ms_wholesale_partners_info_name_key ON sec_cust.ms_wholesale_partners_info USING btree (name)`
- **ms_wholesale_partners_info_slug_key:** `CREATE UNIQUE INDEX ms_wholesale_partners_info_slug_key ON sec_cust.ms_wholesale_partners_info USING btree (slug)`

---

## sec_cust.ms_wholesale_partners_questions {#seccustmswholesalepartnersquestions}

**Type:** BASE TABLE
**Row Count:** 0
**Primary Keys:** id_partner_question

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_partner_question | bigint(64) | NO | nextval('sec_cust.ms_wholesale_partners_questions_id_partner_question_seq'::regclass) | 64 |
| question_type | character varying(50) | NO | NULL | 50 |
| question_value | text | YES | NULL | - |
| question_apb_ok | boolean | YES | NULL | - |
| active | boolean | NO | NULL | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |
| id_partner | integer(32) | NO | NULL | 32 |

### Foreign Keys

| Column | References |
|--------|------------|
| id_partner | sec_cust.ms_wholesale_partners.id_partner |

### Indexes

- **ms_wholesale_partners_questions_pkey:** `CREATE UNIQUE INDEX ms_wholesale_partners_questions_pkey ON sec_cust.ms_wholesale_partners_questions USING btree (id_partner_question)`

---

## sec_cust.pg_stat_statements {#seccustpgstatstatements}

**Type:** VIEW
**Row Count:** 4.987
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| userid | oid | YES | NULL | - |
| dbid | oid | YES | NULL | - |
| queryid | bigint(64) | YES | NULL | 64 |
| query | text | YES | NULL | - |
| plans | bigint(64) | YES | NULL | 64 |
| total_plan_time | double precision(53) | YES | NULL | 53 |
| min_plan_time | double precision(53) | YES | NULL | 53 |
| max_plan_time | double precision(53) | YES | NULL | 53 |
| mean_plan_time | double precision(53) | YES | NULL | 53 |
| stddev_plan_time | double precision(53) | YES | NULL | 53 |
| calls | bigint(64) | YES | NULL | 64 |
| total_exec_time | double precision(53) | YES | NULL | 53 |
| min_exec_time | double precision(53) | YES | NULL | 53 |
| max_exec_time | double precision(53) | YES | NULL | 53 |
| mean_exec_time | double precision(53) | YES | NULL | 53 |
| stddev_exec_time | double precision(53) | YES | NULL | 53 |
| rows | bigint(64) | YES | NULL | 64 |
| shared_blks_hit | bigint(64) | YES | NULL | 64 |
| shared_blks_read | bigint(64) | YES | NULL | 64 |
| shared_blks_dirtied | bigint(64) | YES | NULL | 64 |
| shared_blks_written | bigint(64) | YES | NULL | 64 |
| local_blks_hit | bigint(64) | YES | NULL | 64 |
| local_blks_read | bigint(64) | YES | NULL | 64 |
| local_blks_dirtied | bigint(64) | YES | NULL | 64 |
| local_blks_written | bigint(64) | YES | NULL | 64 |
| temp_blks_read | bigint(64) | YES | NULL | 64 |
| temp_blks_written | bigint(64) | YES | NULL | 64 |
| blk_read_time | double precision(53) | YES | NULL | 53 |
| blk_write_time | double precision(53) | YES | NULL | 53 |
| wal_records | bigint(64) | YES | NULL | 64 |
| wal_fpi | bigint(64) | YES | NULL | 64 |
| wal_bytes | numeric | YES | NULL | - |

---

## sec_cust.risk_levels {#seccustrisklevels}

**Type:** BASE TABLE
**Row Count:** 4
**Primary Keys:** id_risk

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_risk | bigint(64) | NO | nextval('sec_cust.risk_levels_id_risk_seq'::regclass) | 64 |
| level | character varying(100) | NO | NULL | 100 |

### Indexes

- **risk_levels_pkey:** `CREATE UNIQUE INDEX risk_levels_pkey ON sec_cust.risk_levels USING btree (id_risk)`

---

## sec_cust.session_obj {#seccustsessionobj}

**Type:** BASE TABLE
**Row Count:** 0
**Primary Keys:** sid

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| sid | character varying | NO | NULL | - |
| sess | json | NO | NULL | - |
| expire | timestamp without time zone | NO | NULL | - |
| is_authenticated | boolean | YES | NULL | - |
| uuid_user | uuid | YES | NULL | - |
| username | character varying(100) | YES | NULL | 100 |
| first_name | text | YES | NULL | - |
| second_name | text | YES | NULL | - |
| last_name | text | YES | NULL | - |
| second_last_name | text | YES | NULL | - |
| email_user | character varying(100) | YES | NULL | 100 |
| password | text | YES | NULL | - |
| ops_password | text | YES | NULL | - |
| uuid_profile | uuid | YES | NULL | - |
| cust_cr_cod_pub | character varying(100) | YES | NULL | 100 |
| id_verif_level | integer(32) | YES | NULL | 32 |
| cod_rank | character varying(100) | YES | NULL | 100 |
| verif_level_apb | boolean | YES | NULL | - |
| multi_country | boolean | YES | false | - |
| last_session_reg | character varying | YES | NULL | - |
| last_ip_reg | character varying(100) | YES | NULL | 100 |
| last_ip_city_reg | character varying(100) | YES | NULL | 100 |
| last_id_log_reg | integer(32) | YES | NULL | 32 |
| date_last_conn | timestamp with time zone | YES | NULL | - |
| gender | character(1) | YES | NULL | 1 |
| date_birth | timestamp with time zone | YES | NULL | - |
| ident_doc_number | character varying(30) | YES | NULL | 30 |
| main_phone | character varying(30) | YES | NULL | 30 |
| second_phone | character varying(30) | YES | NULL | 30 |
| delegated_phone | character varying(30) | YES | NULL | 30 |
| address | text | YES | NULL | - |
| resid_city | text | YES | NULL | - |
| resid_postal_code | character varying(100) | YES | NULL | 100 |
| referral_node | character varying(30) | YES | NULL | 30 |
| main_sn_platf | character varying(30) | YES | NULL | 30 |
| ok_legal_terms | boolean | YES | NULL | - |
| user_active | boolean | YES | NULL | - |
| user_blocked | boolean | YES | NULL | - |
| date_legacy_reg | timestamp with time zone | YES | now() | - |
| date_creation | timestamp with time zone | YES | now() | - |
| date_last_modif | timestamp with time zone | YES | now() | - |
| roles | json | YES | NULL | - |
| ip_current_con | character varying(100) | YES | NULL | 100 |
| country_ip_current_con | character varying(100) | YES | NULL | 100 |
| routes | json | YES | NULL | - |
| id_user_priv | integer(32) | YES | NULL | 32 |
| id_over_quota | integer(32) | YES | NULL | 32 |
| id_service | integer(32) | YES | NULL | 32 |
| id_services_utype | integer(32) | YES | NULL | 32 |
| id_ident_doc_type | integer(32) | YES | NULL | 32 |
| id_resid_country | integer(32) | YES | NULL | 32 |
| id_nationality_country | integer(32) | YES | NULL | 32 |

### Foreign Keys

| Column | References |
|--------|------------|
| id_over_quota | sec_cust.ms_over_quota.id_over_quota |
| uuid_user | sec_cust.ms_sixmap_users.uuid_user |

### Indexes

- **session_pkey:** `CREATE UNIQUE INDEX session_pkey ON sec_cust.session_obj USING btree (sid)`
- **IDX_session_expire:** `CREATE INDEX "IDX_session_expire" ON sec_cust.session_obj USING btree (expire)`

---

## sec_cust.tmp_ext_oper_v_customers {#seccusttmpextopervcustomers}

**Type:** BASE TABLE
**Row Count:** 0
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| verif_level | text | YES | NULL | - |
| signup_date | timestamp with time zone | YES | NULL | - |
| level_1_aprov_date | timestamp with time zone | YES | NULL | - |
| level_2_aprov_date | timestamp with time zone | YES | NULL | - |
| last_ip_country | character varying(255) | YES | NULL | 255 |
| client_type | character varying(20) | YES | NULL | 20 |
| original_pub_id | character varying | YES | NULL | - |
| sixmap_pub_id | character varying | YES | NULL | - |
| signup_country | character varying(255) | YES | NULL | 255 |
| resid_country | character varying(255) | YES | NULL | 255 |
| names | text | YES | NULL | - |
| last_names | text | YES | NULL | - |
| date_birth | timestamp with time zone | YES | NULL | - |
| sex | character(1) | YES | NULL | 1 |
| nationality_country | character varying(255) | YES | NULL | 255 |
| email_user | character varying(100) | YES | NULL | 100 |
| phone_number | character varying(20) | YES | NULL | 20 |
| doc_type | character varying(50) | YES | NULL | 50 |
| doc_country | character varying(50) | YES | NULL | 50 |
| doc_number | character varying(30) | YES | NULL | 30 |
| state | text | YES | NULL | - |
| resid_city | text | YES | NULL | - |
| address | text | YES | NULL | - |
| referral_id | text | YES | NULL | - |
| main_sn_platf | text | YES | NULL | - |
| user_main_sn_platf | text | YES | NULL | - |
| funds_source | character varying | YES | NULL | - |
| monthly_income | character varying | YES | NULL | - |
| job_title | character varying | YES | NULL | - |
| work_industry | character varying | YES | NULL | - |
| total_referreds | integer(32) | YES | NULL | 32 |
| active_referreds | integer(32) | YES | NULL | 32 |
| first_remittance_date | timestamp with time zone | YES | NULL | - |
| last_remittance_date | timestamp with time zone | YES | NULL | - |
| total_app_remittances | bigint(64) | YES | NULL | 64 |
| total_chat_remittances | bigint(64) | YES | NULL | 64 |

---

## sec_cust.v_bh_users_info {#seccustvbhusersinfo}

**Type:** VIEW
**Row Count:** 0
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| verif_level | text | YES | NULL | - |
| signup_date | timestamp with time zone | YES | NULL | - |
| level_1_aprov_date | timestamp with time zone | YES | NULL | - |
| level_2_aprov_date | timestamp with time zone | YES | NULL | - |
| last_ip_country | character varying(255) | YES | NULL | 255 |
| client_type | character varying(20) | YES | NULL | 20 |
| original_pub_id | character varying | YES | NULL | - |
| sixmap_pub_id | character varying | YES | NULL | - |
| signup_country | character varying(255) | YES | NULL | 255 |
| resid_country | character varying(255) | YES | NULL | 255 |
| names | text | YES | NULL | - |
| last_names | text | YES | NULL | - |
| date_birth | timestamp with time zone | YES | NULL | - |
| sex | character(1) | YES | NULL | 1 |
| nationality_country | character varying(255) | YES | NULL | 255 |
| email_user | character varying(100) | YES | NULL | 100 |
| phone_number | character varying(20) | YES | NULL | 20 |
| doc_type | character varying(50) | YES | NULL | 50 |
| doc_country | character varying(50) | YES | NULL | 50 |
| doc_number | character varying(30) | YES | NULL | 30 |
| state | text | YES | NULL | - |
| resid_city | text | YES | NULL | - |
| address | text | YES | NULL | - |
| referral_id | text | YES | NULL | - |
| main_sn_platf | text | YES | NULL | - |
| user_main_sn_platf | text | YES | NULL | - |
| funds_source | character varying | YES | NULL | - |
| monthly_income | character varying | YES | NULL | - |
| job_title | character varying | YES | NULL | - |
| work_industry | character varying | YES | NULL | - |
| total_referreds | integer(32) | YES | NULL | 32 |
| active_referreds | integer(32) | YES | NULL | 32 |
| first_remittance_date | timestamp with time zone | YES | NULL | - |
| last_remittance_date | timestamp with time zone | YES | NULL | - |
| total_app_remittances | bigint(64) | YES | NULL | 64 |
| total_chat_remittances | bigint(64) | YES | NULL | 64 |

---

## sec_cust.v_users_to_zoho_campaign {#seccustvuserstozohocampaign}

**Type:** VIEW
**Row Count:** 5.055
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| nombre | text | YES | NULL | - |
| apellido | text | YES | NULL | - |
| email | character varying(100) | YES | NULL | 100 |
| cr_id | character varying | YES | NULL | - |
| telefono | character varying(20) | YES | NULL | 20 |
| resid_country | character varying(255) | YES | NULL | 255 |
| nacionalidad | character varying(255) | YES | NULL | 255 |
| sexo | character(1) | YES | NULL | 1 |
| estado | character varying | YES | NULL | - |

---

## sec_cust.v_users_to_zoho_campaign_eu {#seccustvuserstozohocampaigneu}

**Type:** VIEW
**Row Count:** 6
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| nombre | text | YES | NULL | - |
| apellido | text | YES | NULL | - |
| email | character varying(100) | YES | NULL | 100 |
| cr_id | character varying | YES | NULL | - |
| telefono | character varying(20) | YES | NULL | 20 |
| resid_country | character varying(255) | YES | NULL | 255 |
| nacionalidad | character varying(255) | YES | NULL | 255 |
| sexo | character(1) | YES | NULL | 1 |
| estado | character varying | YES | NULL | - |

---

## sec_cust.v_verification_level {#seccustvverificationlevel}

**Type:** VIEW
**Row Count:** 10.109
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_users_verif_level | bigint(64) | YES | NULL | 64 |
| cust_cr_cod_pub | character varying | YES | NULL | - |
| name_country | character varying(255) | YES | NULL | 255 |
| id_vl | integer(32) | YES | NULL | 32 |
| level_apb_ok | boolean | YES | NULL | - |
| doc | character varying | YES | NULL | - |
| comment | character varying | YES | NULL | - |
| name | character varying | YES | NULL | - |
| lastname | character varying | YES | NULL | - |
| fecha | bigint(64) | YES | NULL | 64 |
| name_utype | character varying(50) | YES | NULL | 50 |
| last_ip_city_reg | character varying(100) | YES | NULL | 100 |
| email_user | character varying(100) | YES | NULL | 100 |
| id_migrated | bigint(64) | YES | NULL | 64 |
| silt_id | character varying | YES | NULL | - |

---

## sec_emp.asn_blocks {#secempasnblocks}

**Type:** BASE TABLE
**Row Count:** 536.807
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| network | cidr | YES | NULL | - |
| autonomous_system_number | bigint(64) | YES | NULL | 64 |
| autonomous_system_organization | character varying(255) | YES | NULL | 255 |

---

## sec_emp.geoip_blocks {#secempgeoipblocks}

**Type:** BASE TABLE
**Row Count:** 3.806.136
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| network | cidr | YES | NULL | - |
| geoname_id | bigint(64) | YES | NULL | 64 |
| registered_country_geoname_id | bigint(64) | YES | NULL | 64 |
| represented_country_geoname_id | bigint(64) | YES | NULL | 64 |
| is_anonymous_proxy | boolean | YES | NULL | - |
| is_satellite_provider | boolean | YES | NULL | - |
| postal_code | character varying(8) | YES | NULL | 8 |
| latitude | numeric(9,6) | YES | NULL | 9 |
| longitude | numeric(9,6) | YES | NULL | 9 |
| accuracy_radius | smallint(16) | YES | NULL | 16 |

---

## sec_emp.geoip_locations {#secempgeoiplocations}

**Type:** BASE TABLE
**Row Count:** 122.275
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| geoname_id | bigint(64) | YES | NULL | 64 |
| locale_code | character varying(2) | YES | NULL | 2 |
| continent_code | character varying(2) | YES | NULL | 2 |
| continent_name | character varying(255) | YES | NULL | 255 |
| country_iso_code | character varying(2) | YES | NULL | 2 |
| country_name | character varying(255) | YES | NULL | 255 |
| subdivision_1_iso_code | character varying(3) | YES | NULL | 3 |
| subdivision_1_name | character varying(255) | YES | NULL | 255 |
| subdivision_2_iso_code | character varying(3) | YES | NULL | 3 |
| subdivision_2_name | character varying(255) | YES | NULL | 255 |
| city_name | character varying(255) | YES | NULL | 255 |
| metro_code | character varying(3) | YES | NULL | 3 |
| time_zone | character varying(255) | YES | NULL | 255 |
| is_in_european_union | boolean | YES | NULL | - |

---

## sec_emp.lnk_opspwds_registred_by_user {#secemplnkopspwdsregistredbyuser}

**Type:** BASE TABLE
**Row Count:** 0
**Primary Keys:** id_opspwd

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_opspwd | bigint(64) | NO | nextval('sec_emp.lnk_opspwds_registred_by_user_id_opspwd_seq'::regclass) | 64 |
| opspwd | text | NO | NULL | - |
| active | boolean | NO | NULL | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |
| uuid_user | uuid | NO | NULL | - |

### Foreign Keys

| Column | References |
|--------|------------|
| uuid_user | sec_emp.ms_sixmap_users.uuid_user |

### Indexes

- **lnk_opspwds_registred_by_user_pkey:** `CREATE UNIQUE INDEX lnk_opspwds_registred_by_user_pkey ON sec_emp.lnk_opspwds_registred_by_user USING btree (id_opspwd)`

---

## sec_emp.lnk_profiles_roles {#secemplnkprofilesroles}

**Type:** BASE TABLE
**Row Count:** 332
**Primary Keys:** id_profiles_roles

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_profiles_roles | bigint(64) | NO | nextval('sec_emp.lnk_profiles_roles_id_profiles_roles_seq'::regclass) | 64 |
| active | boolean | NO | NULL | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |
| uuid_profile | uuid | NO | NULL | - |
| uuid_role | uuid | NO | NULL | - |

### Foreign Keys

| Column | References |
|--------|------------|
| uuid_profile | sec_emp.ms_profiles.uuid_profile |
| uuid_role | sec_emp.ms_roles.uuid_role |
| uuid_role | sec_emp.ms_roles.uuid_role |
| uuid_role | sec_emp.ms_roles.uuid_role |
| uuid_role | sec_emp.ms_roles.uuid_role |

### Indexes

- **lnk_profiles_roles_pkey:** `CREATE UNIQUE INDEX lnk_profiles_roles_pkey ON sec_emp.lnk_profiles_roles USING btree (id_profiles_roles)`

---

## sec_emp.lnk_pwds_registred_by_user {#secemplnkpwdsregistredbyuser}

**Type:** BASE TABLE
**Row Count:** 15
**Primary Keys:** id_pwd

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_pwd | bigint(64) | NO | nextval('sec_emp.lnk_pwds_registred_by_user_id_pwd_seq'::regclass) | 64 |
| pwd | text | NO | NULL | - |
| active | boolean | NO | NULL | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |
| uuid_user | uuid | NO | NULL | - |

### Foreign Keys

| Column | References |
|--------|------------|
| uuid_user | sec_emp.ms_sixmap_users.uuid_user |

### Indexes

- **lnk_pwds_registred_by_user_pkey:** `CREATE UNIQUE INDEX lnk_pwds_registred_by_user_pkey ON sec_emp.lnk_pwds_registred_by_user USING btree (id_pwd)`

---

## sec_emp.lnk_roles_routes {#secemplnkrolesroutes}

**Type:** BASE TABLE
**Row Count:** 74
**Primary Keys:** id_roles_routes

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_roles_routes | bigint(64) | NO | nextval('sec_emp.lnk_roles_routes_id_roles_routes_seq'::regclass) | 64 |
| active | boolean | NO | NULL | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |
| uuid_role | uuid | NO | NULL | - |
| uuid_route | uuid | NO | NULL | - |

### Foreign Keys

| Column | References |
|--------|------------|
| uuid_role | sec_emp.ms_roles.uuid_role |
| uuid_role | sec_emp.ms_roles.uuid_role |
| uuid_role | sec_emp.ms_roles.uuid_role |
| uuid_role | sec_emp.ms_roles.uuid_role |
| uuid_route | sec_emp.ms_routes.uuid_route |

### Indexes

- **lnk_roles_routes_pkey:** `CREATE UNIQUE INDEX lnk_roles_routes_pkey ON sec_emp.lnk_roles_routes USING btree (id_roles_routes)`

---

## sec_emp.lnk_users_departments {#secemplnkusersdepartments}

**Type:** BASE TABLE
**Row Count:** 15
**Primary Keys:** id_users_depts

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_users_depts | bigint(64) | NO | nextval('sec_emp.lnk_users_departments_id_users_depts_seq'::regclass) | 64 |
| active | boolean | NO | NULL | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |
| uuid_user | uuid | NO | NULL | - |
| id_dpt | integer(32) | NO | NULL | 32 |

### Foreign Keys

| Column | References |
|--------|------------|
| id_dpt | sec_emp.ms_departments.id_dpt |
| uuid_user | sec_emp.ms_sixmap_users.uuid_user |

### Indexes

- **lnk_users_departments_pkey:** `CREATE UNIQUE INDEX lnk_users_departments_pkey ON sec_emp.lnk_users_departments USING btree (id_users_depts)`

---

## sec_emp.logs_actions_obj {#secemplogsactionsobj}

**Type:** BASE TABLE
**Row Count:** 16.330
**Primary Keys:** id_log

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_log | bigint(64) | NO | nextval('sec_emp.logs_actions_obj_id_log_seq'::regclass) | 64 |
| is_authenticated | boolean | NO | NULL | - |
| success_req | boolean | YES | NULL | - |
| failed_req | boolean | YES | NULL | - |
| ip_orig | character varying(100) | NO | NULL | 100 |
| country_ip_orig | text | YES | NULL | - |
| route | text | YES | NULL | - |
| function_module | text | YES | NULL | - |
| erros_msg | text | YES | NULL | - |
| action_type | text | YES | NULL | - |
| params_req | text | YES | NULL | - |
| date_action | timestamp with time zone | YES | NULL | - |
| post_action_taken | text | YES | NULL | - |
| params_post_action_taken | text | YES | NULL | - |
| active | boolean | NO | NULL | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |
| sid_session | text | YES | NULL | - |

### Indexes

- **logs_actions_obj_pkey:** `CREATE UNIQUE INDEX logs_actions_obj_pkey ON sec_emp.logs_actions_obj USING btree (id_log)`

---

## sec_emp.ms_all_countries {#secempmsallcountries}

**Type:** BASE TABLE
**Row Count:** 250
**Primary Keys:** id_all_country

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_all_country | bigint(64) | NO | nextval('sec_emp.ms_all_countries_id_all_country_seq'::regclass) | 64 |
| country_name | character varying(255) | NO | NULL | 255 |
| spanish_name | character varying(255) | YES | NULL | 255 |
| country_iso_code | character varying(10) | NO | NULL | 10 |
| is_latin | boolean | NO | false | - |
| active | boolean | NO | true | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |
| is_europe | boolean | NO | false | - |

### Indexes

- **ms_all_countries_pkey:** `CREATE UNIQUE INDEX ms_all_countries_pkey ON sec_emp.ms_all_countries USING btree (id_all_country)`

---

## sec_emp.ms_atc_hours {#secempmsatchours}

**Type:** BASE TABLE
**Row Count:** 13
**Primary Keys:** id_atc_hours

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_atc_hours | bigint(64) | NO | nextval('sec_emp.ms_atc_hours_id_atc_hours_seq'::regclass) | 64 |
| id_country | bigint(64) | NO | NULL | 64 |
| from_hour | character varying | YES | NULL | - |
| to_hour | character varying | YES | NULL | - |
| time_zone | character varying | YES | NULL | - |

### Foreign Keys

| Column | References |
|--------|------------|
| id_country | sec_emp.ms_countries.id_country |

### Indexes

- **ms_atc_hours_pkey:** `CREATE UNIQUE INDEX ms_atc_hours_pkey ON sec_emp.ms_atc_hours USING btree (id_atc_hours)`
- **ms_atc_hours_id_country_key:** `CREATE UNIQUE INDEX ms_atc_hours_id_country_key ON sec_emp.ms_atc_hours USING btree (id_country)`

---

## sec_emp.ms_companies_competition {#secempmscompaniescompetition}

**Type:** BASE TABLE
**Row Count:** 39
**Primary Keys:** id_company_competition

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_company_competition | bigint(64) | NO | nextval('sec_emp.ms_companies_competition_id_company_competition_seq'::regclass) | 64 |
| name_company | character varying(255) | NO | NULL | 255 |
| type_url | character varying(255) | NO | 'instagram'::character varying | 255 |
| url_company | character varying(255) | NO | NULL | 255 |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |
| id_country | bigint(64) | NO | NULL | 64 |
| active | boolean | NO | true | - |

### Foreign Keys

| Column | References |
|--------|------------|
| id_country | sec_emp.ms_countries.id_country |

### Indexes

- **ms_companies_competition_pkey:** `CREATE UNIQUE INDEX ms_companies_competition_pkey ON sec_emp.ms_companies_competition USING btree (id_company_competition)`

---

## sec_emp.ms_competition_rates {#secempmscompetitionrates}

**Type:** BASE TABLE
**Row Count:** 2.472
**Primary Keys:** id_competition_rate

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_competition_rate | bigint(64) | NO | nextval('sec_emp.ms_competition_rates_id_competition_rate_seq'::regclass) | 64 |
| rate_factor | double precision(53) | NO | 0 | 53 |
| operation | character varying(3) | NO | 'mul'::character varying | 3 |
| active | boolean | NO | true | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |
| id_origin_country | bigint(64) | NO | NULL | 64 |
| id_destiny_country | bigint(64) | NO | NULL | 64 |
| id_currency_origin | bigint(64) | YES | NULL | 64 |
| id_currency_destiny | bigint(64) | YES | NULL | 64 |
| id_competition_company | bigint(64) | NO | NULL | 64 |
| updated_group | bigint(64) | NO | 1 | 64 |

### Foreign Keys

| Column | References |
|--------|------------|
| id_competition_company | sec_emp.ms_companies_competition.id_company_competition |
| id_destiny_country | sec_emp.ms_countries.id_country |
| id_origin_country | sec_emp.ms_countries.id_country |

### Indexes

- **ms_competition_rates_pkey:** `CREATE UNIQUE INDEX ms_competition_rates_pkey ON sec_emp.ms_competition_rates USING btree (id_competition_rate)`

---

## sec_emp.ms_competitions_captures {#secempmscompetitionscaptures}

**Type:** BASE TABLE
**Row Count:** 0
**Primary Keys:** id_competition_capture

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_competition_capture | bigint(64) | NO | nextval('sec_emp.ms_competitions_captures_id_competition_capture_seq'::regclass) | 64 |
| name_path | character varying(255) | NO | NULL | 255 |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |
| inserted | boolean | NO | false | - |
| id_company_competition | bigint(64) | NO | NULL | 64 |

### Foreign Keys

| Column | References |
|--------|------------|
| id_company_competition | sec_emp.ms_companies_competition.id_company_competition |

### Indexes

- **ms_competitions_captures_pkey:** `CREATE UNIQUE INDEX ms_competitions_captures_pkey ON sec_emp.ms_competitions_captures USING btree (id_competition_capture)`

---

## sec_emp.ms_countries {#secempmscountries}

**Type:** BASE TABLE
**Row Count:** 14
**Primary Keys:** id_country

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_country | bigint(64) | NO | nextval('sec_emp.ms_countries_id_country_seq'::regclass) | 64 |
| name_country | character varying(255) | NO | NULL | 255 |
| viewing_name | character varying(255) | NO | NULL | 255 |
| country_iso_code | character varying(20) | NO | NULL | 20 |
| pol_exp | boolean | NO | false | - |
| sixmap_active | boolean | NO | NULL | - |
| criptoremesa_active | boolean | NO | NULL | - |
| bithonor_active | boolean | NO | NULL | - |
| criptoefectivo_active | boolean | NO | NULL | - |
| country_active | boolean | NO | NULL | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |
| id_ip_country | integer(32) | NO | NULL | 32 |
| is_europe | boolean | NO | false | - |
| is_latam | boolean | NO | false | - |
| allow_passport_as_payment_field | boolean | NO | false | - |
| beneficiaries_full_contact_required | boolean | NO | false | - |

### Foreign Keys

| Column | References |
|--------|------------|
| id_ip_country | sec_emp.ms_ip_countries.id_ip_country |

### Indexes

- **ms_countries_pkey:** `CREATE UNIQUE INDEX ms_countries_pkey ON sec_emp.ms_countries USING btree (id_country)`
- **ms_countries_id_ip_country_key:** `CREATE UNIQUE INDEX ms_countries_id_ip_country_key ON sec_emp.ms_countries USING btree (id_ip_country)`

---

## sec_emp.ms_departments {#secempmsdepartments}

**Type:** BASE TABLE
**Row Count:** 11
**Primary Keys:** id_dpt

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_dpt | bigint(64) | NO | nextval('sec_emp.ms_departments_id_dpt_seq'::regclass) | 64 |
| name_dpt | text | NO | NULL | - |
| active | boolean | NO | NULL | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |

### Indexes

- **ms_departments_pkey:** `CREATE UNIQUE INDEX ms_departments_pkey ON sec_emp.ms_departments USING btree (id_dpt)`

---

## sec_emp.ms_doc_type {#secempmsdoctype}

**Type:** BASE TABLE
**Row Count:** 3
**Primary Keys:** id_ident_doc_type

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_ident_doc_type | bigint(64) | NO | nextval('sec_emp.ms_doc_type_id_ident_doc_type_seq'::regclass) | 64 |
| name_doc_type | character varying(50) | NO | NULL | 50 |
| active | boolean | NO | NULL | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |
| id_resid_country | integer(32) | NO | NULL | 32 |

### Foreign Keys

| Column | References |
|--------|------------|
| id_resid_country | sec_emp.ms_countries.id_country |

### Indexes

- **ms_doc_type_pkey:** `CREATE UNIQUE INDEX ms_doc_type_pkey ON sec_emp.ms_doc_type USING btree (id_ident_doc_type)`

---

## sec_emp.ms_forgot_password_attempt {#secempmsforgotpasswordattempt}

**Type:** BASE TABLE
**Row Count:** 0
**Primary Keys:** id_email_send

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_email_send | integer(32) | NO | nextval('sec_emp.ms_forgot_password_attempt_id_email_send_seq'::regclass) | 32 |
| email_attempt | integer(32) | YES | NULL | 32 |
| created_date | timestamp with time zone | NO | now() | - |
| modification_date | timestamp with time zone | NO | now() | - |
| id_user | integer(32) | NO | NULL | 32 |
| last_email_attempt | timestamp with time zone | YES | NULL | - |

### Foreign Keys

| Column | References |
|--------|------------|
| id_user | sec_emp.ms_sixmap_users.id_user |

### Indexes

- **ms_forgot_password_attempt_pkey:** `CREATE UNIQUE INDEX ms_forgot_password_attempt_pkey ON sec_emp.ms_forgot_password_attempt USING btree (id_email_send)`

---

## sec_emp.ms_ip_countries {#secempmsipcountries}

**Type:** BASE TABLE
**Row Count:** 3.802.379
**Primary Keys:** id_ip_country

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_ip_country | bigint(64) | NO | nextval('sec_emp.ms_ip_countries_id_ip_country_seq'::regclass) | 64 |
| network | character varying(255) | NO | NULL | 255 |
| city_name | character varying(255) | YES | NULL | 255 |
| country_name | character varying(255) | NO | NULL | 255 |
| country_iso_code | character varying(10) | NO | NULL | 10 |
| time_zone | character varying(255) | NO | NULL | 255 |
| active | boolean | NO | true | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |

### Indexes

- **ms_ip_countries_pkey:** `CREATE UNIQUE INDEX ms_ip_countries_pkey ON sec_emp.ms_ip_countries USING btree (id_ip_country)`
- **ms_ip_countries_country_name_country_iso_code_idx:** `CREATE INDEX ms_ip_countries_country_name_country_iso_code_idx ON sec_emp.ms_ip_countries USING btree (country_name, country_iso_code)`

---

## sec_emp.ms_migration_error_reports {#secempmsmigrationerrorreports}

**Type:** BASE TABLE
**Row Count:** 1
**Primary Keys:** id_report

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_report | bigint(64) | NO | nextval('sec_emp.ms_migration_error_reports_id_report_seq'::regclass) | 64 |
| user_number | integer(32) | NO | NULL | 32 |
| user_cr_id | character varying | YES | NULL | - |
| report_text | text | NO | NULL | - |
| active | boolean | NO | true | - |

### Indexes

- **ms_migration_error_reports_pkey:** `CREATE UNIQUE INDEX ms_migration_error_reports_pkey ON sec_emp.ms_migration_error_reports USING btree (id_report)`

---

## sec_emp.ms_over_quota {#secempmsoverquota}

**Type:** BASE TABLE
**Row Count:** 0
**Primary Keys:** id_over_quota

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_over_quota | bigint(64) | NO | nextval('sec_emp.ms_over_quota_id_over_quota_seq'::regclass) | 64 |
| routes | jsonb | NO | NULL | - |
| active | boolean | NO | NULL | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |
| uuid_user | uuid | NO | NULL | - |

### Foreign Keys

| Column | References |
|--------|------------|
| uuid_user | sec_emp.ms_sixmap_users.uuid_user |

### Indexes

- **ms_over_quota_pkey:** `CREATE UNIQUE INDEX ms_over_quota_pkey ON sec_emp.ms_over_quota USING btree (id_over_quota)`

---

## sec_emp.ms_phone {#secempmsphone}

**Type:** BASE TABLE
**Row Count:** 12
**Primary Keys:** id_phone

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_phone | bigint(64) | NO | nextval('sec_emp.ms_phone_id_phone_seq'::regclass) | 64 |
| type | character varying(50) | NO | NULL | 50 |
| code | character varying(10) | NO | NULL | 10 |
| number | character varying(20) | NO | NULL | 20 |
| full_number | character varying(20) | NO | NULL | 20 |
| mobile | boolean | NO | NULL | - |
| home | boolean | NO | NULL | - |
| office | boolean | NO | NULL | - |
| whatsapp | boolean | NO | NULL | - |
| telegram | boolean | NO | NULL | - |
| active | boolean | NO | NULL | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |
| uuid_user | uuid | NO | NULL | - |

### Foreign Keys

| Column | References |
|--------|------------|
| uuid_user | sec_emp.ms_sixmap_users.uuid_user |

### Indexes

- **ms_phone_pkey:** `CREATE UNIQUE INDEX ms_phone_pkey ON sec_emp.ms_phone USING btree (id_phone)`

---

## sec_emp.ms_profiles {#secempmsprofiles}

**Type:** BASE TABLE
**Row Count:** 19
**Primary Keys:** uuid_profile

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| uuid_profile | uuid | NO | uuid_generate_v4() | - |
| name_profile | character varying(20) | NO | NULL | 20 |
| active | boolean | NO | NULL | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |
| uuid_profile_son | uuid | YES | NULL | - |

### Foreign Keys

| Column | References |
|--------|------------|
| uuid_profile_son | sec_emp.ms_profiles.uuid_profile |

### Indexes

- **ms_profiles_pkey:** `CREATE UNIQUE INDEX ms_profiles_pkey ON sec_emp.ms_profiles USING btree (uuid_profile)`

---

## sec_emp.ms_properties {#secempmsproperties}

**Type:** BASE TABLE
**Row Count:** 0
**Primary Keys:** id_property

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_property | bigint(64) | NO | nextval('sec_emp.ms_properties_id_property_seq'::regclass) | 64 |
| value_property | character varying(255) | NO | NULL | 255 |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |
| id_company_competition | bigint(64) | NO | NULL | 64 |

### Foreign Keys

| Column | References |
|--------|------------|
| id_company_competition | sec_emp.ms_companies_competition.id_company_competition |

### Indexes

- **ms_properties_pkey:** `CREATE UNIQUE INDEX ms_properties_pkey ON sec_emp.ms_properties USING btree (id_property)`

---

## sec_emp.ms_roles {#secempmsroles}

**Type:** BASE TABLE
**Row Count:** 70
**Primary Keys:** uuid_role

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| uuid_role | uuid | NO | uuid_generate_v4() | - |
| name_role | character varying(20) | NO | NULL | 20 |
| active | boolean | NO | NULL | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |

### Indexes

- **ms_roles_pkey:** `CREATE UNIQUE INDEX ms_roles_pkey ON sec_emp.ms_roles USING btree (uuid_role)`

---

## sec_emp.ms_routes {#secempmsroutes}

**Type:** BASE TABLE
**Row Count:** 74
**Primary Keys:** uuid_route

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| uuid_route | uuid | NO | uuid_generate_v4() | - |
| name_route | character varying | NO | NULL | - |
| icon | character varying(20) | YES | NULL | 20 |
| url | text | YES | NULL | - |
| component | text | YES | NULL | - |
| active | boolean | NO | true | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |
| uuid_route_father | uuid | YES | NULL | - |
| route_id | character varying | YES | NULL | - |
| external_url | character varying | YES | NULL | - |
| order_view | integer(32) | YES | NULL | 32 |
| label | character varying | YES | NULL | - |

### Foreign Keys

| Column | References |
|--------|------------|
| uuid_route_father | sec_emp.ms_routes.uuid_route |

### Indexes

- **ms_routes_pkey:** `CREATE UNIQUE INDEX ms_routes_pkey ON sec_emp.ms_routes USING btree (uuid_route)`

---

## sec_emp.ms_sixmap_services {#secempmssixmapservices}

**Type:** BASE TABLE
**Row Count:** 4
**Primary Keys:** id_service

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_service | bigint(64) | NO | nextval('sec_emp.ms_sixmap_services_id_service_seq'::regclass) | 64 |
| tx_service | character varying(50) | NO | NULL | 50 |
| active | boolean | NO | NULL | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |

### Indexes

- **ms_sixmap_services_pkey:** `CREATE UNIQUE INDEX ms_sixmap_services_pkey ON sec_emp.ms_sixmap_services USING btree (id_service)`

---

## sec_emp.ms_sixmap_services_utype {#secempmssixmapservicesutype}

**Type:** BASE TABLE
**Row Count:** 5
**Primary Keys:** id_services_utype

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_services_utype | bigint(64) | NO | nextval('sec_emp.ms_sixmap_services_utype_id_services_utype_seq'::regclass) | 64 |
| name_utype | character varying(50) | NO | NULL | 50 |
| active | boolean | NO | NULL | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |
| id_service | integer(32) | NO | NULL | 32 |

### Foreign Keys

| Column | References |
|--------|------------|
| id_service | sec_emp.ms_sixmap_services.id_service |

### Indexes

- **ms_sixmap_services_utype_pkey:** `CREATE UNIQUE INDEX ms_sixmap_services_utype_pkey ON sec_emp.ms_sixmap_services_utype USING btree (id_services_utype)`

---

## sec_emp.ms_sixmap_users {#secempmssixmapusers}

**Type:** BASE TABLE
**Row Count:** 30
**Primary Keys:** id_user, uuid_user

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_user | bigint(64) | NO | nextval('sec_emp.ms_sixmap_users_id_user_seq'::regclass) | 64 |
| uuid_user | uuid | NO | uuid_generate_v4() | - |
| username | character varying(100) | NO | NULL | 100 |
| email_user | character varying(100) | YES | NULL | 100 |
| fake_name | character varying(200) | YES | NULL | 200 |
| password | text | NO | NULL | - |
| ops_password | text | YES | NULL | - |
| last_session_reg | character varying | YES | NULL | - |
| last_ip_reg | character varying(100) | YES | NULL::character varying | 100 |
| last_ip_city_reg | character varying(100) | YES | NULL::character varying | 100 |
| last_id_log_reg | integer(32) | YES | NULL | 32 |
| date_last_conn | timestamp with time zone | NO | NULL | - |
| gender | character(1) | NO | NULL | 1 |
| date_birth | timestamp with time zone | YES | NULL | - |
| ident_doc_number | character varying(30) | NO | NULL | 30 |
| main_phone | character varying(30) | NO | NULL | 30 |
| second_phone | character varying(30) | YES | NULL | 30 |
| delegated_phone | character varying(30) | YES | NULL | 30 |
| resid_city | text | NO | NULL | - |
| user_active | boolean | NO | NULL | - |
| user_blocked | boolean | NO | NULL | - |
| date_legacy_reg | timestamp with time zone | NO | now() | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |
| user_reg_finished | boolean | YES | false | - |
| uuid_profile | uuid | YES | NULL | - |
| id_user_priv | integer(32) | NO | NULL | 32 |
| id_service | integer(32) | YES | NULL | 32 |
| id_services_utype | integer(32) | YES | NULL | 32 |
| id_ident_doc_type | integer(32) | NO | NULL | 32 |
| id_resid_country | integer(32) | NO | NULL | 32 |
| id_nationality_country | integer(32) | NO | NULL | 32 |
| in_turn | boolean | NO | false | - |
| login_attempts | integer(32) | YES | NULL | 32 |
| id_verif_level | integer(32) | YES | NULL | 32 |
| verif_level_apb | boolean | YES | NULL | - |
| last_login_attempt | timestamp with time zone | YES | NULL | - |
| password_attempt | integer(32) | YES | NULL | 32 |
| last_password_attempt | timestamp with time zone | YES | NULL | - |

### Foreign Keys

| Column | References |
|--------|------------|
| id_resid_country | sec_emp.ms_countries.id_country |
| id_ident_doc_type | sec_emp.ms_doc_type.id_ident_doc_type |
| id_nationality_country | sec_emp.ms_ip_countries.id_ip_country |
| uuid_profile | sec_emp.ms_profiles.uuid_profile |
| id_service | sec_emp.ms_sixmap_services.id_service |
| id_services_utype | sec_emp.ms_sixmap_services_utype.id_services_utype |

### Indexes

- **ms_sixmap_users_pkey:** `CREATE UNIQUE INDEX ms_sixmap_users_pkey ON sec_emp.ms_sixmap_users USING btree (id_user, uuid_user)`
- **ms_sixmap_users_id_user_key:** `CREATE UNIQUE INDEX ms_sixmap_users_id_user_key ON sec_emp.ms_sixmap_users USING btree (id_user)`
- **ms_sixmap_users_uuid_user_key:** `CREATE UNIQUE INDEX ms_sixmap_users_uuid_user_key ON sec_emp.ms_sixmap_users USING btree (uuid_user)`
- **ms_sixmap_users_username_key:** `CREATE UNIQUE INDEX ms_sixmap_users_username_key ON sec_emp.ms_sixmap_users USING btree (username)`
- **ms_sixmap_users_email_user_key:** `CREATE UNIQUE INDEX ms_sixmap_users_email_user_key ON sec_emp.ms_sixmap_users USING btree (email_user)`
- **ms_sixmap_users_fake_name_key:** `CREATE UNIQUE INDEX ms_sixmap_users_fake_name_key ON sec_emp.ms_sixmap_users USING btree (fake_name)`

---

## sec_emp.ms_state_countries {#secempmsstatecountries}

**Type:** BASE TABLE
**Row Count:** 573
**Primary Keys:** id_state_country

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_state_country | bigint(64) | NO | nextval('sec_emp.ms_state_countries_id_state_country_seq'::regclass) | 64 |
| state_name | character varying(255) | NO | NULL | 255 |
| id_country | integer(32) | NO | NULL | 32 |

### Foreign Keys

| Column | References |
|--------|------------|
| id_country | sec_emp.ms_countries.id_country |

### Indexes

- **ms_state_countries_pkey:** `CREATE UNIQUE INDEX ms_state_countries_pkey ON sec_emp.ms_state_countries USING btree (id_state_country)`

---

## sec_emp.ms_temp_codes {#secempmstempcodes}

**Type:** BASE TABLE
**Row Count:** 1
**Primary Keys:** id_code

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_code | bigint(64) | NO | nextval('sec_emp.ms_temp_codes_id_code_seq'::regclass) | 64 |
| code | integer(32) | NO | NULL | 32 |
| date_start | timestamp with time zone | NO | now() | - |
| expire | integer(32) | NO | NULL | 32 |
| active | boolean | NO | NULL | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |
| ident_user | text | NO | NULL | - |

### Indexes

- **ms_temp_codes_pkey:** `CREATE UNIQUE INDEX ms_temp_codes_pkey ON sec_emp.ms_temp_codes USING btree (id_code)`

---

## sec_emp.ms_users_migrated {#secempmsusersmigrated}

**Type:** BASE TABLE
**Row Count:** 1.958
**Primary Keys:** id_migration

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_migration | bigint(64) | NO | nextval('sec_emp.ms_users_migrated_id_migration_seq'::regclass) | 64 |
| user_number | bigint(64) | NO | NULL | 64 |
| custom_migrated | boolean | NO | true | - |
| exc_multi_cou_dest | boolean | NO | NULL | - |
| exc_limit_send | boolean | NO | NULL | - |
| exc_resid_country | boolean | NO | NULL | - |
| exc_phone_country | boolean | NO | NULL | - |
| id_exc_resid_country | integer(32) | YES | NULL | 32 |
| id_exc_phone_country | integer(32) | YES | NULL | 32 |
| id_country_default | integer(32) | NO | NULL | 32 |
| first_name | character varying | NO | NULL | - |
| middle_name | character varying | YES | NULL | - |
| last_name | character varying | NO | NULL | - |
| second_last_name | character varying | YES | NULL | - |
| email_user | character varying | NO | NULL | - |
| user_cr_id | character varying | NO | NULL | - |
| cod_rank | integer(32) | YES | 1 | 32 |
| gender | character varying | NO | NULL | - |
| date_birth | timestamp with time zone | YES | NULL | - |
| id_doc_type | integer(32) | YES | NULL | 32 |
| ident_number | character varying | YES | NULL | - |
| id_nationality_country | integer(32) | YES | NULL | 32 |
| main_phone_full | character varying | NO | NULL | - |
| main_phone_code | character varying | NO | NULL | - |
| id_resid_country | integer(32) | NO | NULL | 32 |
| state_name | character varying | YES | NULL | - |
| address | character varying | YES | NULL | - |
| referral_code | character varying | YES | NULL | - |
| main_platform | character varying | YES | NULL | - |
| username_main_platform | character varying | YES | NULL | - |
| legal_terms | boolean | NO | NULL | - |
| legacy_date_register | timestamp with time zone | NO | NULL | - |
| verif_level | integer(32) | NO | NULL | 32 |
| occupation | character varying | YES | NULL | - |
| doc_path | character varying | YES | NULL | - |
| selfie_path | character varying | YES | NULL | - |
| funds_source | character varying | YES | NULL | - |
| industry_job | character varying | YES | NULL | - |
| job_position | character varying | YES | NULL | - |
| salary_range | character varying | YES | NULL | - |
| residency_proof_path | character varying | YES | NULL | - |
| no_pep | character varying | YES | NULL | - |
| auth_verif_info | character varying | YES | NULL | - |
| funds_legality | character varying | YES | NULL | - |
| password | character varying | NO | NULL | - |
| date_migration_created | timestamp with time zone | NO | now() | - |
| active | boolean | NO | true | - |
| hash_password | character varying | YES | NULL | - |
| no_market_chosen | boolean | YES | NULL | - |

### Foreign Keys

| Column | References |
|--------|------------|
| id_country_default | sec_emp.ms_countries.id_country |
| id_exc_phone_country | sec_emp.ms_all_countries.id_all_country |
| id_exc_resid_country | sec_emp.ms_all_countries.id_all_country |
| id_nationality_country | sec_emp.ms_all_countries.id_all_country |
| id_resid_country | sec_emp.ms_all_countries.id_all_country |

### Indexes

- **ms_users_migrated_pkey:** `CREATE UNIQUE INDEX ms_users_migrated_pkey ON sec_emp.ms_users_migrated USING btree (id_migration)`
- **ms_users_migrated_user_number_key:** `CREATE UNIQUE INDEX ms_users_migrated_user_number_key ON sec_emp.ms_users_migrated USING btree (user_number)`
- **ms_users_migrated_email_user_key:** `CREATE UNIQUE INDEX ms_users_migrated_email_user_key ON sec_emp.ms_users_migrated USING btree (email_user)`
- **ms_users_migrated_user_cr_id_key:** `CREATE UNIQUE INDEX ms_users_migrated_user_cr_id_key ON sec_emp.ms_users_migrated USING btree (user_cr_id)`
- **ms_users_migrated_main_phone_full_key:** `CREATE UNIQUE INDEX ms_users_migrated_main_phone_full_key ON sec_emp.ms_users_migrated USING btree (main_phone_full)`

---

## sec_emp.session_obj {#secempsessionobj}

**Type:** BASE TABLE
**Row Count:** 4
**Primary Keys:** sid

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| sid | character varying | NO | NULL | - |
| sess | json | NO | NULL | - |
| expire | timestamp without time zone | NO | NULL | - |
| is_authenticated | boolean | YES | NULL | - |
| uuid_user | uuid | YES | NULL | - |
| username | character varying(100) | YES | NULL | 100 |
| first_name | text | YES | NULL | - |
| second_name | text | YES | NULL | - |
| last_name | text | YES | NULL | - |
| second_last_name | text | YES | NULL | - |
| email_user | character varying(100) | YES | NULL | 100 |
| password | text | YES | NULL | - |
| ops_password | text | YES | NULL | - |
| uuid_profile | uuid | YES | NULL | - |
| cust_cr_cod_pub | character varying(100) | YES | NULL | 100 |
| id_verif_level | integer(32) | YES | NULL | 32 |
| cod_rank | character varying(100) | YES | NULL | 100 |
| verif_level_apb | boolean | YES | NULL | - |
| multi_country | boolean | YES | false | - |
| last_session_reg | character varying | YES | NULL | - |
| last_ip_reg | character varying(100) | YES | NULL | 100 |
| last_ip_city_reg | character varying(100) | YES | NULL | 100 |
| last_id_log_reg | integer(32) | YES | NULL | 32 |
| date_last_conn | timestamp with time zone | YES | NULL | - |
| gender | character(1) | YES | NULL | 1 |
| date_birth | timestamp with time zone | YES | NULL | - |
| ident_doc_number | character varying(30) | YES | NULL | 30 |
| main_phone | character varying(30) | YES | NULL | 30 |
| second_phone | character varying(30) | YES | NULL | 30 |
| delegated_phone | character varying(30) | YES | NULL | 30 |
| address | text | YES | NULL | - |
| resid_city | text | YES | NULL | - |
| resid_postal_code | character varying(100) | YES | NULL | 100 |
| referral_node | character varying(30) | YES | NULL | 30 |
| main_sn_platf | character varying(30) | YES | NULL | 30 |
| ok_legal_terms | boolean | YES | NULL | - |
| user_active | boolean | YES | NULL | - |
| user_blocked | boolean | YES | NULL | - |
| date_legacy_reg | timestamp with time zone | YES | now() | - |
| date_creation | timestamp with time zone | YES | now() | - |
| date_last_modif | timestamp with time zone | YES | now() | - |
| roles | json | YES | NULL | - |
| ip_current_con | character varying(100) | YES | NULL | 100 |
| country_ip_current_con | character varying(100) | YES | NULL | 100 |
| routes | json | YES | NULL | - |
| id_user_priv | integer(32) | YES | NULL | 32 |
| id_over_quota | integer(32) | YES | NULL | 32 |
| id_service | integer(32) | YES | NULL | 32 |
| id_services_utype | integer(32) | YES | NULL | 32 |
| id_ident_doc_type | integer(32) | YES | NULL | 32 |
| id_resid_country | integer(32) | YES | NULL | 32 |
| id_nationality_country | integer(32) | YES | NULL | 32 |

### Foreign Keys

| Column | References |
|--------|------------|
| id_over_quota | sec_emp.ms_over_quota.id_over_quota |
| id_over_quota | sec_emp.ms_over_quota.id_over_quota |
| uuid_user | sec_emp.ms_sixmap_users.uuid_user |
| uuid_user | sec_emp.ms_sixmap_users.uuid_user |

### Indexes

- **session_pkey:** `CREATE UNIQUE INDEX session_pkey ON sec_emp.session_obj USING btree (sid)`
- **IDX_session_expire:** `CREATE INDEX "IDX_session_expire" ON sec_emp.session_obj USING btree (expire)`

---

## sec_emp.v_account_type {#secempvaccounttype}

**Type:** VIEW
**Row Count:** 5
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| account_type | character varying(20) | YES | NULL | 20 |

---

## sec_emp.v_banks_accounts {#secempvbanksaccounts}

**Type:** VIEW
**Row Count:** 40
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_bank_account | integer(32) | YES | NULL | 32 |
| account_holder_type | character varying(20) | YES | NULL | 20 |
| account_holder_name | character varying(100) | YES | NULL | 100 |
| account_type | character varying(20) | YES | NULL | 20 |
| account_number | character varying(200) | YES | NULL | 200 |
| account_holder_id_doc | character varying(50) | YES | NULL | 50 |
| status | boolean | YES | NULL | - |
| bank_name | character varying(100) | YES | NULL | 100 |
| currency_name | character varying(50) | YES | NULL | 50 |
| iso_cod | character varying(5) | YES | NULL | 5 |
| type | character varying(6) | YES | NULL | 6 |
| pay_method_type | character varying(40) | YES | NULL | 40 |
| viewing_name | character varying | YES | NULL | - |

---

## sec_emp.v_competition_company {#secempvcompetitioncompany}

**Type:** VIEW
**Row Count:** 39
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_company_competition | bigint(64) | YES | NULL | 64 |
| name_company | character varying(255) | YES | NULL | 255 |
| type_url | character varying(255) | YES | NULL | 255 |
| url_company | character varying(255) | YES | NULL | 255 |
| active | boolean | YES | NULL | - |
| date_creation | bigint(64) | YES | NULL | 64 |
| date_modified | bigint(64) | YES | NULL | 64 |
| id_country | bigint(64) | YES | NULL | 64 |
| name_country | character varying(255) | YES | NULL | 255 |
| viewing_name | character varying(255) | YES | NULL | 255 |
| iso_cod | character varying(5) | YES | NULL | 5 |

---

## sec_emp.v_competition_rates {#secempvcompetitionrates}

**Type:** VIEW
**Row Count:** 2.472
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_competition_rate | bigint(64) | YES | NULL | 64 |
| rate_factor | double precision(53) | YES | NULL | 53 |
| operation | character varying(3) | YES | NULL | 3 |
| id_competition_company | bigint(64) | YES | NULL | 64 |
| id_origin_country | bigint(64) | YES | NULL | 64 |
| id_destiny_country | bigint(64) | YES | NULL | 64 |
| id_currency_origin | bigint(64) | YES | NULL | 64 |
| id_currency_destiny | bigint(64) | YES | NULL | 64 |
| date_last_modif | timestamp with time zone | YES | NULL | - |
| name_company | character varying(255) | YES | NULL | 255 |
| origin_currency | character varying(5) | YES | NULL | 5 |
| origin_country | character varying(255) | YES | NULL | 255 |
| destiny_currency | character varying(5) | YES | NULL | 5 |
| destiny_country | character varying(255) | YES | NULL | 255 |

---

## sec_emp.v_historical_competition_rates {#secempvhistoricalcompetitionrates}

**Type:** VIEW
**Row Count:** 2.573
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_competition_rate | bigint(64) | YES | NULL | 64 |
| rate_factor | double precision(53) | YES | NULL | 53 |
| operation | character varying(3) | YES | NULL | 3 |
| id_competition_company | bigint(64) | YES | NULL | 64 |
| id_origin_country | bigint(64) | YES | NULL | 64 |
| id_destiny_country | bigint(64) | YES | NULL | 64 |
| id_currency_origin | bigint(64) | YES | NULL | 64 |
| id_currency_destiny | bigint(64) | YES | NULL | 64 |
| date_creation | bigint(64) | YES | NULL | 64 |
| date_modified | bigint(64) | YES | NULL | 64 |
| name_company | character varying(255) | YES | NULL | 255 |
| origin_currency | character varying(5) | YES | NULL | 5 |
| origin_country | character varying(255) | YES | NULL | 255 |
| destiny_currency | character varying(5) | YES | NULL | 5 |
| destiny_country | character varying(255) | YES | NULL | 255 |

---

## sec_emp.v_pay_method {#secempvpaymethod}

**Type:** VIEW
**Row Count:** 16
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| name | character varying(40) | YES | NULL | 40 |

---

## sec_emp.v_ranking_competition_rates {#secempvrankingcompetitionrates}

**Type:** VIEW
**Row Count:** 326
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id | bigint(64) | YES | NULL | 64 |
| name | character varying | YES | NULL | - |
| rate_factor | double precision(53) | YES | NULL | 53 |
| date_last_modif | timestamp with time zone | YES | NULL | - |
| id_origin_currency | bigint(64) | YES | NULL | 64 |
| id_destiny_currency | bigint(64) | YES | NULL | 64 |
| active | boolean | YES | NULL | - |
| id_country | bigint(64) | YES | NULL | 64 |
| competition_rate | boolean | YES | NULL | - |
| operation | character varying | YES | NULL | - |

---

## sec_emp.v_verification_level {#secempvverificationlevel}

**Type:** VIEW
**Row Count:** 10.109
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_users_verif_level | bigint(64) | YES | NULL | 64 |
| cust_cr_cod_pub | character varying | YES | NULL | - |
| name_country | character varying(255) | YES | NULL | 255 |
| id_vl | integer(32) | YES | NULL | 32 |
| level_apb_ok | boolean | YES | NULL | - |
| doc | character varying | YES | NULL | - |
| comment | character varying | YES | NULL | - |
| name | character varying | YES | NULL | - |
| lastname | character varying | YES | NULL | - |
| fecha | bigint(64) | YES | NULL | 64 |
| name_utype | character varying(50) | YES | NULL | 50 |
| last_ip_city_reg | character varying(100) | YES | NULL | 100 |
| email_user | character varying(100) | YES | NULL | 100 |
| id_migrated | bigint(64) | YES | NULL | 64 |

---

