CREATE OR REPLACE FUNCTION sec_cust.sp_ms_cr_rate_get_valid(_id_origin_country integer, _id_origin_currency integer, _id_destiny_country integer, _id_destiny_currency integer, _email_user character varying)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
declare
				is_valid_for_birthday       BOOLEAN;
				is_valid_for_first_oper     BOOLEAN;
				resp_obj       				JSONB;
				best_special_rate       	JSONB;
				best_vip_rate       		JSONB;
				manual_rates	       		JSONB;
				automatic_rates       		JSONB;
				best_manual_rate_value    	FLOAT;
				best_special_rate_value    	FLOAT;
			begin
				raise notice 'LLEGANDO _id_origin_country: %', _id_origin_country;
				raise notice 'LLEGANDO _id_origin_currency: %', _id_origin_currency;
				raise notice 'LLEGANDO _id_origin_country: %', _id_destiny_country;
				raise notice 'LLEGANDO _id_destiny_currency: %', _id_destiny_currency;
				raise notice 'LLEGANDO _email_user: %', _email_user;

				-- obtener todas las tasas vip a las que aplica el usuario
					-- mismos paises y monedas
					-- from_date < NOW() < to_date
					-- activa
					-- publicada

				SELECT * INTO best_vip_rate
				FROM sec_cust.get_best_vip_rate(_id_origin_country,_id_origin_currency,_id_destiny_country,_id_destiny_currency,_email_user);

				raise notice 'best_vip_rate: %', best_vip_rate;

				IF (best_vip_rate IS NOT NULL)
				THEN
					resp_obj := json_build_object(
								'type', 'VIP',
								'rates', best_vip_rate->0
								);

					return resp_obj;
				END IF;

				SELECT * INTO is_valid_for_birthday
				FROM sec_cust.is_valid_for_birthday(_email_user);

				SELECT * INTO is_valid_for_first_oper
				FROM sec_cust.is_valid_for_first_oper(_email_user);

				-- obtener la mejor tasa especial a la que aplica el usuario

-- 				SELECT * INTO best_special_rate
-- 				FROM sec_cust.get_best_special_rate(_id_origin_country,_id_origin_currency,_id_destiny_country,_id_destiny_currency,_email_user);

				raise notice 'best_special_rate: %', best_special_rate;

				SELECT * INTO manual_rates
				FROM sec_cust.get_user_manual_rates(_id_origin_country,_id_origin_currency,_id_destiny_country,_id_destiny_currency,is_valid_for_birthday,is_valid_for_first_oper,_email_user);

				raise notice 'MANUAL RATES: %', manual_rates;


				IF (best_special_rate IS NOT NULL AND manual_rates IS NOT NULL)
				THEN
					IF (jsonb_array_length(manual_rates) > 1)
					THEN
						resp_obj := json_build_object(
								'type', 'SPECIAL',
								'rates', best_special_rate
								);
						return resp_obj;
					ELSIF (jsonb_array_length(manual_rates) = 1)
					THEN
						best_manual_rate_value := (manual_rates->0->>'rate_factor')::FLOAT;
						best_special_rate_value := (best_special_rate->>'rate_factor')::FLOAT;

						IF (best_special_rate->>'operation'::TEXT = 'mul')
						THEN
							IF (best_special_rate_value > best_manual_rate_value)
							THEN
								raise notice 'SPECIAL MAYOR';

								resp_obj := json_build_object(
									'type', 'SPECIAL',
									'rates', best_special_rate
									);
							ELSIF (best_special_rate_value < best_manual_rate_value)
							THEN
								raise notice 'MANUAL MENOR';

								resp_obj := json_build_object(
									'type', 'MANUAL',
									'rates', manual_rates->0
									);
							ELSE
								raise notice 'NI MAYOR NI MENOR';

								resp_obj := json_build_object(
									'type', 'SPECIAL',
									'rates', best_special_rate
									);
							END IF;
						ELSIF (best_special_rate->>'operation'::TEXT = 'div')
						THEN
							IF (best_special_rate_value < best_manual_rate_value)
							THEN
								raise notice 'SPECIAL MENOR';

								resp_obj := json_build_object(
									'type', 'SPECIAL',
									'rates', best_special_rate
									);
							ELSIF (best_special_rate_value > best_manual_rate_value)
							THEN
								raise notice 'MANUAL MENOR';

								resp_obj := json_build_object(
									'type', 'MANUAL',
									'rates', manual_rates->0
									);
							ELSE
								raise notice 'NI MAYOR NI MENOR';

								resp_obj := json_build_object(
									'type', 'SPECIAL',
									'rates', best_special_rate
									);
							END IF;
						END IF;
					END IF;
				ELSIF (best_special_rate IS NOT NULL)
				THEN
					resp_obj := json_build_object(
									'type', 'SPECIAL',
									'rates', best_special_rate
									);
				ELSIF (manual_rates IS NOT NULL)
				THEN
					resp_obj := json_build_object(
									'type', 'MANUAL',
									'rates', manual_rates
									);
				END IF;

				return resp_obj;
			end;
$function$

