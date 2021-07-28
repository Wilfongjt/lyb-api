
\c pg_db;
SET search_path TO api_0_0_1, base_0_0_1, public;

/*

Delete

     _      _      _
    | |    | |    | |
  __| | ___| | ___| |_ ___
 / _` |/ _ \ |/ _ \ __/ _ \
| (_| |  __/ |  __/ ||  __/
 \__,_|\___|_|\___|\__\___|

*/

-- DELETE

BEGIN;

  SELECT plan(3);

  \set notfoundUserName '''notfound@user.com'''
  \set username '''delete@user.com'''
  \set displayname '''J'''
  \set type_ '''const#USER'''
  \set key1 '''duckduckgoose'''
  \set pkName '''username'''
  \set pk format('''%s#%s''',:pkName, :username)
  \set form format('''{"%s":"%s", "displayname":"%s", "password":"a1!Aaaaa"}''', :pkName, :username, :displayname)::JSONB
  \set criteriaOK format('''{"pk":"%s#%s", "sk":"%s"}''', :pkName, :username, :type_ )::JSONB
  \set criteriaNF format('''{"pk":"%s#%s", "sk":"%s"}''', :pkName, :notfoundUserName, :type_ )::JSONB
  
  insert into base_0_0_1.one
    (pk,sk,tk,form,owner)
    values
    (format('%s#%s',:pkName, :username), :type_, :key1, :form,  :key1 ) ;-- returning * into iRec;

  --Select * from base_0_0_1.one; 

  SELECT has_function(
      'base_0_0_1',
      'delete',
      ARRAY[ 'JSONB', 'TEXT' ],
      'Function Delete (jsonb,text) exists'
  );

  -- 2

  SELECT is (

    base_0_0_1.delete( :criteriaNF, :key1 )::JSONB,

    '{"msg": "Not Found", "owner": "duckduckgoose", "status": "404", "criteria": {"pk": "username#notfound@user.com", "sk": "const#USER"}}'::JSONB,

    'delete pk sk form,  Not Found 0_0_1'::TEXT

  );

  -- 3

  SELECT is (

    (base_0_0_1.delete(

      format('{"pk":"%s#%s", "sk":"%s"}', :pkName::TEXT, :username::TEXT, :type_::TEXT)::JSONB,

      :key1

    )::JSONB - '{"deletion","criteria"}'::TEXT[]),

    '{"msg":"OK","status":"200"}'::JSONB,

    'delete pk sk form,  OK 0_0_1'::TEXT

  );

  SELECT * FROM finish();

ROLLBACK;

END;
