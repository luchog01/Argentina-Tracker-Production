#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# Home Broker API - Market data downloader
# https://github.com/crapher/pyhomebroker.git
#
# Copyright 2020 Diego Degese
#
# Licensed under the Apache License, Version 2.0 (the 'License');
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an 'AS IS' BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
print("Start...")
import datetime
from pyhomebroker import HomeBroker

broker = "265"
dni = "43626546"
user = "Luciano"
password = "Lucigar01.."

hb = HomeBroker(int(broker))
hb.auth.login(dni=dni, user=user, password=password, raise_exception=True)

# traer el dia de ayer y el dia de hoy y agarrar el ultimo disponible
data = list(dict(hb.history.get_daily_history('VIST', datetime.date.today()-datetime.timedelta(days=5), datetime.date.today()))["close"])
print(data)