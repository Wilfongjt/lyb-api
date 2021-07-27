
\c pg_db;

SET search_path TO api_0_0_1,  base_0_0_1, public;


--==================

-- Chelate

--==================

/*

__      __   _ _     _       _          _____ _          _       _
\ \    / /  | (_)   | |     | |        / ____| |        | |     | |
 \ \  / /_ _| |_  __| | __ _| |_ ___  | |    | |__   ___| | __ _| |_ ___
  \ \/ / _` | | |/ _` |/ _` | __/ _ \ | |    | '_ \ / _ \ |/ _` | __/ _ \
   \  / (_| | | | (_| | (_| | ||  __/ | |____| | | |  __/ | (_| | ||  __/
    \/ \__,_|_|_|\__,_|\__,_|\__\___|  \_____|_| |_|\___|_|\__,_|\__\___|

*/



BEGIN;



  SELECT plan(2);



  -- 1

  SELECT has_function(

      'base_0_0_1',

      'validate_chelate',

      ARRAY[ 'JSONB', 'TEXT' ],

      'Function validate_chelate(jsonb, TEXT) exists'

  );

  SELECT ok (

    base_0_0_1.validate_chelate(

      '{}'::JSONB,

      'pstfoacu'::TEXT

    )::JSONB is not NULL,

    'validate_chelate (chelate JSONB, expected TEXT) 0_0_1'::TEXT

  );

  SELECT ok (

    base_0_0_1.validate_chelate(

      '{

          "pk":"a#v1",

          "sk":"b#v2",

          "tk":"c#v3",

          "form": {

            "a":"v1",

            "b":"v2",

            "c":"v3",

            "d":"v4"

          }

        }'::JSONB,

        'PSTFoacu'::TEXT

    )::JSONB is not NULL,

    'validate_chelate (chelate JSONB, expected TEXT) 0_0_1'::TEXT

  );

  SELECT * FROM finish();



ROLLBACK;
