create or replace function prc_mng.sp_lnk_cr_remittances_complete(p_id_remittance integer, p_transfer_name character varying, p_verif_number character varying, p_confirm_number character varying, p_beneficiaries jsonb[], p_username character varying) returns json
    language plpgsql
as
$$
declare
    v_id_remittance                 int;
    v_rem_date_closed               int;
    v_id_origin_transaction         int;
    v_id_bank_account_origin        int;
    v_beneficiary                   jsonb;
    v_uuid_user                     uuid;
    v_id_origin_country             int;
    v_amount                        float;
    v_doc_number                    varchar;
    v_name                          varchar;
    v_email                         varchar;
    v_pub_id                        varchar;
begin

    -- verifica que la remesa exista, y que no este finalizada

    select
        rem.id_remittance, extract(epoch from rem.date_closed), tr.id_bank_account, rat.id_origin_country,
        rem.total_origin_amount, us.ident_doc_number, concat(pr.first_name, ' ', pr.last_name), us.email_user, rem.id_remittance_pub
    into
        v_id_remittance, v_rem_date_closed, v_id_bank_account_origin,
        v_id_origin_country, v_amount, v_doc_number, v_name, v_email, v_pub_id
    from prc_mng.lnk_cr_remittances rem
    inner join prc_mng.ms_cr_origin_transactions tr on rem.id_remittance = tr.id_remittance
    inner join sec_cust.ms_cr_manual_rate rat on rem.id_manual_rate = rat.id_manual_rate
    inner join sec_cust.ms_sixmap_users us on rem.id_client = us.id_user
    inner join priv.ms_sixmap_users pr on us.id_user_priv = pr.id_user_priv
    where rem.id_remittance = p_id_remittance;
    if (v_id_remittance is null) then
        raise exception 'Remittance not found';
    end if;
    if (v_rem_date_closed is not null) then
        raise exception 'Remittance already closed';
    end if;
    select tr.id_transaction into v_id_origin_transaction
    from prc_mng.ms_cr_origin_transactions tr
    where tr.id_remittance = v_id_remittance;
    select us.uuid_user into v_uuid_user
    from sec_emp.ms_sixmap_users us
    where us.username = p_username;

    -- Hace la verificación bancaria

    update prc_mng.ms_cr_origin_transactions
    set verif_number = p_verif_number, comp_number = p_confirm_number, modification_date = now(), transfer_name = p_transfer_name,
        id_transaction_type = 1, date_received = created_date::timestamp, id_bank_account = v_id_bank_account_origin, bank_verification = true
    where id_transaction = v_id_origin_transaction;

    -- Hace la transferencia a los beneficiarios

    foreach v_beneficiary in array p_beneficiaries loop
        update prc_mng.ms_cr_beneficiaries
        set id_bank_account = (v_beneficiary ->> 'idBankAccount')::int, path_name = (v_beneficiary ->> 'captureName')::varchar,
            tranf_ref_number = (v_beneficiary ->> 'refNumber')::varchar, date_closed = now(), transfer_successful = true, uuid_sixmap_user = v_uuid_user
        where id_beneficiary = (v_beneficiary ->> 'idBeneficiary')::int;
        if ((v_beneficiary ->> 'fee')::float != 0) then
            insert into prc_mng.ms_transfer_fees (id_bank_account, amount, uuid_user, id_transfer)
            values ((v_beneficiary ->> 'idBankAccount')::int, (v_beneficiary ->> 'fee')::float, v_uuid_user, (v_beneficiary ->> 'idBeneficiary')::int);
        end if;
    end loop;

    -- Cambia los estatus a las remesas

    update prc_mng.lnk_cr_remittances
    set date_closed = now(), id_ppl_status = (
        select ppl.id_ppl_status
        from prc_mng.ms_remittance_principal_status ppl
        where ppl.name = 'Completada'
    ), id_pub_status = (
        select pub.id_pub_status
        from prc_mng.ms_remittance_public_status pub
        where pub.name = 'Completada'
    ),
    id_rev_status = (
        select rev.id_rev_status
        from prc_mng.ms_remittance_revision_status rev
        where rev.name = 'Realizada'
    ),
    id_ver_status = (
        select ver.id_ver_status
        from prc_mng.ms_remittance_bank_verif_status ver
        where ver.name = 'Realizada'
    ),
    to_tranf = true,
    tranf = true,
    notif_client = true,
    id_notif_status = (
        select notif.id_notif_status
        from prc_mng.ms_remittance_notif_benef_status notif
        where notif.name = 'Realizada'
    )
    where id_remittance = v_id_remittance;

    -- envia los datos necesarios para la facturación

    return json_build_object(
        'idOriginCountry', v_id_origin_country,
        'amount', v_amount,
        'docNumber', v_doc_number,
        'name', v_name,
        'email', v_email,
        'publicId', v_pub_id,
        'date', now()::date
    );
end;
$$;