const observation = `<?xml version="1.0" encoding="UTF-8"?>
<wfs:FeatureCollection
    timeStamp="2018-10-26T19:26:06Z"
    numberMatched="13"
    numberReturned="13"
           xmlns:wfs="http://www.opengis.net/wfs/2.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:om="http://www.opengis.net/om/2.0"
        xmlns:ompr="http://inspire.ec.europa.eu/schemas/ompr/3.0"
        xmlns:omso="http://inspire.ec.europa.eu/schemas/omso/3.0"
        xmlns:gml="http://www.opengis.net/gml/3.2" xmlns:gmd="http://www.isotc211.org/2005/gmd"
        xmlns:gco="http://www.isotc211.org/2005/gco" xmlns:swe="http://www.opengis.net/swe/2.0"
        xmlns:gmlcov="http://www.opengis.net/gmlcov/1.0"
        xmlns:sam="http://www.opengis.net/sampling/2.0"
        xmlns:sams="http://www.opengis.net/samplingSpatial/2.0"
        xmlns:wml2="http://www.opengis.net/waterml/2.0"
	xmlns:target="http://xml.fmi.fi/namespace/om/atmosphericfeatures/1.0"
        xsi:schemaLocation="http://www.opengis.net/wfs/2.0 http://schemas.opengis.net/wfs/2.0/wfs.xsd
        http://www.opengis.net/gmlcov/1.0 http://schemas.opengis.net/gmlcov/1.0/gmlcovAll.xsd
        http://www.opengis.net/sampling/2.0 http://schemas.opengis.net/sampling/2.0/samplingFeature.xsd
        http://www.opengis.net/samplingSpatial/2.0 http://schemas.opengis.net/samplingSpatial/2.0/spatialSamplingFeature.xsd
        http://www.opengis.net/swe/2.0 http://schemas.opengis.net/sweCommon/2.0/swe.xsd
        http://inspire.ec.europa.eu/schemas/ompr/3.0 http://inspire.ec.europa.eu/schemas/ompr/3.0/Processes.xsd
        http://inspire.ec.europa.eu/schemas/omso/3.0 http://inspire.ec.europa.eu/schemas/omso/3.0/SpecialisedObservations.xsd
        http://www.opengis.net/waterml/2.0 http://schemas.opengis.net/waterml/2.0/waterml2.xsd
        http://xml.fmi.fi/namespace/om/atmosphericfeatures/1.0 http://xml.fmi.fi/schema/om/atmosphericfeatures/1.0/atmosphericfeatures.xsd">
   
	    <wfs:member>
                <omso:PointTimeSeriesObservation gml:id="WFS-jwuS6cLQtiTsYlzxwFwpOwasUQqJTowqYWbbpdOt.Lnl5dsPTTv3c3Trvlw9NGXk6ddNO3L2w7OuXhh08oWliy59O6pp25bUX8Kp08ZxxGNj5c61ItCnHdOmjJq4Z2XdkqaduW1F_CqdNFUkRnZtunnpyc6zGLBg5aOXRry.e._lkv7.2Xl35aemHFsyxMzZh6ZefSJmbN.PDsy1qZtN.NJXdemZw1tuHxE08.mHdjy0rV0IDS24fEXhvx6Oc4Mcze25emXfQw8sO3L0y8udY3Rlta23Tz56d2epl8dKxp2Gc2t3XbPzU.mHpp37uc4TW49cOzT08yd2bfE1ufTD00791Tzwy1ob.GXdkw9MLc59N_LLk49cvLzf05K0ws23S6db8XPLy7Yemnfu5unXfLh6aMvJ066aduXth2dcvDDp5NDpp25afTLwmaHTTty2t.7LWNVqQwA-">

		            <om:phenomenonTime>
        <gml:TimePeriod  gml:id="time1-1-1">
          <gml:beginPosition>2018-10-26T19:14:00Z</gml:beginPosition>
          <gml:endPosition>2018-10-26T19:26:00Z</gml:endPosition>
        </gml:TimePeriod>
      </om:phenomenonTime>
      <om:resultTime>
        <gml:TimeInstant gml:id="time2-1-1">
          <gml:timePosition>2018-10-26T19:26:00Z</gml:timePosition>
        </gml:TimeInstant>
      </om:resultTime>      

		<om:procedure xlink:href="http://xml.fmi.fi/inspire/process/opendata"/>
   		            <om:parameter>
                <om:NamedValue>
                    <om:name xlink:href="http://inspire.ec.europa.eu/codeList/ProcessParameterValue/value/groundObservation/observationIntent"/>
                    <om:value>
			atmosphere
                    </om:value>
                </om:NamedValue>
            </om:parameter>

                <om:observedProperty  xlink:href="https://opendata.fmi.fi/meta?observableProperty=observation&amp;param=t2m&amp;language=eng"/>
				<om:featureOfInterest>
                    <sams:SF_SpatialSamplingFeature gml:id="fi-1-1-t2m">
          <sam:sampledFeature>
		<target:LocationCollection gml:id="sampled-target-1-1-t2m">
		    <target:member>
		    <target:Location gml:id="obsloc-fmisid-100949-pos-t2m">
		        <gml:identifier codeSpace="http://xml.fmi.fi/namespace/stationcode/fmisid">100949</gml:identifier>
			<gml:name codeSpace="http://xml.fmi.fi/namespace/locationcode/name">Turku Artukainen</gml:name>
			<gml:name codeSpace="http://xml.fmi.fi/namespace/locationcode/geoid">-16000132</gml:name>
			<gml:name codeSpace="http://xml.fmi.fi/namespace/locationcode/wmo">2773</gml:name>
			<target:representativePoint xlink:href="#point-fmisid-100949-1-1-t2m"/>
			
			
			<target:region codeSpace="http://xml.fmi.fi/namespace/location/region">Turku</target:region>
			
		    </target:Location></target:member>
		</target:LocationCollection>
 	   </sam:sampledFeature>
                        <sams:shape>
                            
			    <gml:Point gml:id="point-fmisid-100949-1-1-t2m" srsName="http://www.opengis.net/def/crs/EPSG/0/4258" srsDimension="2">
                                <gml:name>Turku Artukainen</gml:name>
                                <gml:pos>60.45439 22.17870 </gml:pos>
                            </gml:Point>
                            
                        </sams:shape>
                    </sams:SF_SpatialSamplingFeature>
                </om:featureOfInterest>
		  <om:result>
                    <wml2:MeasurementTimeseries gml:id="obs-obs-1-1-t2m">                         
                        <wml2:point>
                            <wml2:MeasurementTVP> 
                                      <wml2:time>2018-10-26T19:20:00Z</wml2:time>
				      <wml2:value>1.3</wml2:value>
                            </wml2:MeasurementTVP>
                        </wml2:point>                         
                    </wml2:MeasurementTimeseries>
                </om:result>

        </omso:PointTimeSeriesObservation>
    </wfs:member>
	    <wfs:member>
                <omso:PointTimeSeriesObservation gml:id="WFS-UKDPzhWeUMbiAx9a3Jv5KgnbwEWJTowqYWbbpdOt.Lnl5dsPTTv3c3Trvlw9NGXk6ddNO3L2w7OuXhh08oWliy59O6pp25bUX8Kp08ZxxGNj5c61ItCnHdOmjJq4Z2XdkqaduW1F_CqdNFUkRnZtunnpyc6zGLBg5aOXRry.e._lkv7.2Xl35aemHFsyxMzZh6ZefSJmbN.PDsy1qZtN.NJXdemZw1tuHxE08.mHdjy0rV0IDS24fEXhvx6Oc4Mcze25emXfQw8sO3L0y8udaHfnfYsNunc1tunnz07s9TL46VjTsM5tbuu2fmp9MPTTv3c5wmtx64dmnp5k7s2.Jrc.mHpp37qnnhlrQ38Mu7Jh6YW5z6b.WXJx65eXm_pyVphZtul0634ueXl2w9NO_dzdOu.XD00ZeTp1007cvbDs65eGHTyaHTTty0.mXhM0Omnbltb92WsarUhg">

		      
      <om:phenomenonTime xlink:href="#time1-1-1"/>
      <om:resultTime xlink:href="#time2-1-1"/>      

		<om:procedure xlink:href="http://xml.fmi.fi/inspire/process/opendata"/>
   		            <om:parameter>
                <om:NamedValue>
                    <om:name xlink:href="http://inspire.ec.europa.eu/codeList/ProcessParameterValue/value/groundObservation/observationIntent"/>
                    <om:value>
			atmosphere
                    </om:value>
                </om:NamedValue>
            </om:parameter>

                <om:observedProperty  xlink:href="https://opendata.fmi.fi/meta?observableProperty=observation&amp;param=ws_10min&amp;language=eng"/>
				<om:featureOfInterest>
                    <sams:SF_SpatialSamplingFeature gml:id="fi-1-1-ws_10min">
          <sam:sampledFeature>
		<target:LocationCollection gml:id="sampled-target-1-1-ws_10min">
		    <target:member>
		    <target:Location gml:id="obsloc-fmisid-100949-pos-ws_10min">
		        <gml:identifier codeSpace="http://xml.fmi.fi/namespace/stationcode/fmisid">100949</gml:identifier>
			<gml:name codeSpace="http://xml.fmi.fi/namespace/locationcode/name">Turku Artukainen</gml:name>
			<gml:name codeSpace="http://xml.fmi.fi/namespace/locationcode/geoid">-16000132</gml:name>
			<gml:name codeSpace="http://xml.fmi.fi/namespace/locationcode/wmo">2773</gml:name>
			<target:representativePoint xlink:href="#point-fmisid-100949-1-1-ws_10min"/>
			
			
			<target:region codeSpace="http://xml.fmi.fi/namespace/location/region">Turku</target:region>
			
		    </target:Location></target:member>
		</target:LocationCollection>
 	   </sam:sampledFeature>
                        <sams:shape>
                            
			    <gml:Point gml:id="point-fmisid-100949-1-1-ws_10min" srsName="http://www.opengis.net/def/crs/EPSG/0/4258" srsDimension="2">
                                <gml:name>Turku Artukainen</gml:name>
                                <gml:pos>60.45439 22.17870 </gml:pos>
                            </gml:Point>
                            
                        </sams:shape>
                    </sams:SF_SpatialSamplingFeature>
                </om:featureOfInterest>
		  <om:result>
                    <wml2:MeasurementTimeseries gml:id="obs-obs-1-1-ws_10min">                         
                        <wml2:point>
                            <wml2:MeasurementTVP> 
                                      <wml2:time>2018-10-26T19:20:00Z</wml2:time>
				      <wml2:value>2.8</wml2:value>
                            </wml2:MeasurementTVP>
                        </wml2:point>                         
                    </wml2:MeasurementTimeseries>
                </om:result>

        </omso:PointTimeSeriesObservation>
    </wfs:member>
	    <wfs:member>
                <omso:PointTimeSeriesObservation gml:id="WFS-dEmnxhRtJN0Vi9I0O9bCDfyre_CJTowqYWbbpdOt.Lnl5dsPTTv3c3Trvlw9NGXk6ddNO3L2w7OuXhh08oWliy59O6pp25bUX8Kp08ZxxGNj5c61ItCnHdOmjJq4Z2XdkqaduW1F_CqdNFUkRnZtunnpyc6zGLBg5aOXRry.e._lkv7.2Xl35aemHFsyxMzZh6ZefSJmbN.PDsy1qZtN.NJXdemZw1tuHxE08.mHdjy0rV0IDS24fEXhvx6Oc4Mcze25emXfQw8sO3L0y8udaHfPfYsNunc1tunnz07s9TL46VjTsM5tbuu2fmp9MPTTv3c5wmtx64dmnp5k7s2.Jrc.mHpp37qnnhlrQ38Mu7Jh6YW5z6b.WXJx65eXm_pyVphZtul0634ueXl2w9NO_dzdOu.XD00ZeTp1007cvbDs65eGHTyaHTTty0.mXhM0Omnbltb92WsarUhg">

		      
      <om:phenomenonTime xlink:href="#time1-1-1"/>
      <om:resultTime xlink:href="#time2-1-1"/>      

		<om:procedure xlink:href="http://xml.fmi.fi/inspire/process/opendata"/>
   		            <om:parameter>
                <om:NamedValue>
                    <om:name xlink:href="http://inspire.ec.europa.eu/codeList/ProcessParameterValue/value/groundObservation/observationIntent"/>
                    <om:value>
			atmosphere
                    </om:value>
                </om:NamedValue>
            </om:parameter>

                <om:observedProperty  xlink:href="https://opendata.fmi.fi/meta?observableProperty=observation&amp;param=wg_10min&amp;language=eng"/>
				<om:featureOfInterest>
                    <sams:SF_SpatialSamplingFeature gml:id="fi-1-1-wg_10min">
          <sam:sampledFeature>
		<target:LocationCollection gml:id="sampled-target-1-1-wg_10min">
		    <target:member>
		    <target:Location gml:id="obsloc-fmisid-100949-pos-wg_10min">
		        <gml:identifier codeSpace="http://xml.fmi.fi/namespace/stationcode/fmisid">100949</gml:identifier>
			<gml:name codeSpace="http://xml.fmi.fi/namespace/locationcode/name">Turku Artukainen</gml:name>
			<gml:name codeSpace="http://xml.fmi.fi/namespace/locationcode/geoid">-16000132</gml:name>
			<gml:name codeSpace="http://xml.fmi.fi/namespace/locationcode/wmo">2773</gml:name>
			<target:representativePoint xlink:href="#point-fmisid-100949-1-1-wg_10min"/>
			
			
			<target:region codeSpace="http://xml.fmi.fi/namespace/location/region">Turku</target:region>
			
		    </target:Location></target:member>
		</target:LocationCollection>
 	   </sam:sampledFeature>
                        <sams:shape>
                            
			    <gml:Point gml:id="point-fmisid-100949-1-1-wg_10min" srsName="http://www.opengis.net/def/crs/EPSG/0/4258" srsDimension="2">
                                <gml:name>Turku Artukainen</gml:name>
                                <gml:pos>60.45439 22.17870 </gml:pos>
                            </gml:Point>
                            
                        </sams:shape>
                    </sams:SF_SpatialSamplingFeature>
                </om:featureOfInterest>
		  <om:result>
                    <wml2:MeasurementTimeseries gml:id="obs-obs-1-1-wg_10min">                         
                        <wml2:point>
                            <wml2:MeasurementTVP> 
                                      <wml2:time>2018-10-26T19:20:00Z</wml2:time>
				      <wml2:value>4.2</wml2:value>
                            </wml2:MeasurementTVP>
                        </wml2:point>                         
                    </wml2:MeasurementTimeseries>
                </om:result>

        </omso:PointTimeSeriesObservation>
    </wfs:member>
	    <wfs:member>
                <omso:PointTimeSeriesObservation gml:id="WFS-xLKDJXksHBGA6kVXHCmix7zoqdyJTowqYWbbpdOt.Lnl5dsPTTv3c3Trvlw9NGXk6ddNO3L2w7OuXhh08oWliy59O6pp25bUX8Kp08ZxxGNj5c61ItCnHdOmjJq4Z2XdkqaduW1F_CqdNFUkRnZtunnpyc6zGLBg5aOXRry.e._lkv7.2Xl35aemHFsyxMzZh6ZefSJmbN.PDsy1qZtN.NJXdemZw1tuHxE08.mHdjy0rV0IDS24fEXhvx6Oc4Mcze25emXfQw8sO3L0y8udaHfJfYsNunc1tunnz07s9TL46VjTsM5tbuu2fmp9MPTTv3c5wmtx64dmnp5k7s2.Jrc.mHpp37qnnhlrQ38Mu7Jh6YW5z6b.WXJx65eXm_pyVphZtul0634ueXl2w9NO_dzdOu.XD00ZeTp1007cvbDs65eGHTyaHTTty0.mXhM0Omnbltb92WsarUhg">

		      
      <om:phenomenonTime xlink:href="#time1-1-1"/>
      <om:resultTime xlink:href="#time2-1-1"/>      

		<om:procedure xlink:href="http://xml.fmi.fi/inspire/process/opendata"/>
   		            <om:parameter>
                <om:NamedValue>
                    <om:name xlink:href="http://inspire.ec.europa.eu/codeList/ProcessParameterValue/value/groundObservation/observationIntent"/>
                    <om:value>
			atmosphere
                    </om:value>
                </om:NamedValue>
            </om:parameter>

                <om:observedProperty  xlink:href="https://opendata.fmi.fi/meta?observableProperty=observation&amp;param=wd_10min&amp;language=eng"/>
				<om:featureOfInterest>
                    <sams:SF_SpatialSamplingFeature gml:id="fi-1-1-wd_10min">
          <sam:sampledFeature>
		<target:LocationCollection gml:id="sampled-target-1-1-wd_10min">
		    <target:member>
		    <target:Location gml:id="obsloc-fmisid-100949-pos-wd_10min">
		        <gml:identifier codeSpace="http://xml.fmi.fi/namespace/stationcode/fmisid">100949</gml:identifier>
			<gml:name codeSpace="http://xml.fmi.fi/namespace/locationcode/name">Turku Artukainen</gml:name>
			<gml:name codeSpace="http://xml.fmi.fi/namespace/locationcode/geoid">-16000132</gml:name>
			<gml:name codeSpace="http://xml.fmi.fi/namespace/locationcode/wmo">2773</gml:name>
			<target:representativePoint xlink:href="#point-fmisid-100949-1-1-wd_10min"/>
			
			
			<target:region codeSpace="http://xml.fmi.fi/namespace/location/region">Turku</target:region>
			
		    </target:Location></target:member>
		</target:LocationCollection>
 	   </sam:sampledFeature>
                        <sams:shape>
                            
			    <gml:Point gml:id="point-fmisid-100949-1-1-wd_10min" srsName="http://www.opengis.net/def/crs/EPSG/0/4258" srsDimension="2">
                                <gml:name>Turku Artukainen</gml:name>
                                <gml:pos>60.45439 22.17870 </gml:pos>
                            </gml:Point>
                            
                        </sams:shape>
                    </sams:SF_SpatialSamplingFeature>
                </om:featureOfInterest>
		  <om:result>
                    <wml2:MeasurementTimeseries gml:id="obs-obs-1-1-wd_10min">                         
                        <wml2:point>
                            <wml2:MeasurementTVP> 
                                      <wml2:time>2018-10-26T19:20:00Z</wml2:time>
				      <wml2:value>24.0</wml2:value>
                            </wml2:MeasurementTVP>
                        </wml2:point>                         
                    </wml2:MeasurementTimeseries>
                </om:result>

        </omso:PointTimeSeriesObservation>
    </wfs:member>
	    <wfs:member>
                <omso:PointTimeSeriesObservation gml:id="WFS-rbgfDv5YyVGyKRkgzo3cdtXrohyJTowqYWbbpdOt.Lnl5dsPTTv3c3Trvlw9NGXk6ddNO3L2w7OuXhh08oWliy59O6pp25bUX8Kp08ZxxGNj5c61ItCnHdOmjJq4Z2XdkqaduW1F_CqdNFUkRnZtunnpyc6zGLBg5aOXRry.e._lkv7.2Xl35aemHFsyxMzZh6ZefSJmbN.PDsy1qZtN.NJXdemZw1tuHxE08.mHdjy0rV0IDS24fEXhvx6Oc4Mcze25emXfQw8sO3L0y8udYnLQ1tunnz07s9TL46VjTsM5tbuu2fmp9MPTTv3c5wmtx64dmnp5k7s2.Jrc.mHpp37qnnhlrQ38Mu7Jh6YW5z6b.WXJx65eXm_pyVphZtul0634ueXl2w9NO_dzdOu.XD00ZeTp1007cvbDs65eGHTyaHTTty0.mXhM0Omnbltb92WsarUhgA--">

		      
      <om:phenomenonTime xlink:href="#time1-1-1"/>
      <om:resultTime xlink:href="#time2-1-1"/>      

		<om:procedure xlink:href="http://xml.fmi.fi/inspire/process/opendata"/>
   		            <om:parameter>
                <om:NamedValue>
                    <om:name xlink:href="http://inspire.ec.europa.eu/codeList/ProcessParameterValue/value/groundObservation/observationIntent"/>
                    <om:value>
			atmosphere
                    </om:value>
                </om:NamedValue>
            </om:parameter>

                <om:observedProperty  xlink:href="https://opendata.fmi.fi/meta?observableProperty=observation&amp;param=rh&amp;language=eng"/>
				<om:featureOfInterest>
                    <sams:SF_SpatialSamplingFeature gml:id="fi-1-1-rh">
          <sam:sampledFeature>
		<target:LocationCollection gml:id="sampled-target-1-1-rh">
		    <target:member>
		    <target:Location gml:id="obsloc-fmisid-100949-pos-rh">
		        <gml:identifier codeSpace="http://xml.fmi.fi/namespace/stationcode/fmisid">100949</gml:identifier>
			<gml:name codeSpace="http://xml.fmi.fi/namespace/locationcode/name">Turku Artukainen</gml:name>
			<gml:name codeSpace="http://xml.fmi.fi/namespace/locationcode/geoid">-16000132</gml:name>
			<gml:name codeSpace="http://xml.fmi.fi/namespace/locationcode/wmo">2773</gml:name>
			<target:representativePoint xlink:href="#point-fmisid-100949-1-1-rh"/>
			
			
			<target:region codeSpace="http://xml.fmi.fi/namespace/location/region">Turku</target:region>
			
		    </target:Location></target:member>
		</target:LocationCollection>
 	   </sam:sampledFeature>
                        <sams:shape>
                            
			    <gml:Point gml:id="point-fmisid-100949-1-1-rh" srsName="http://www.opengis.net/def/crs/EPSG/0/4258" srsDimension="2">
                                <gml:name>Turku Artukainen</gml:name>
                                <gml:pos>60.45439 22.17870 </gml:pos>
                            </gml:Point>
                            
                        </sams:shape>
                    </sams:SF_SpatialSamplingFeature>
                </om:featureOfInterest>
		  <om:result>
                    <wml2:MeasurementTimeseries gml:id="obs-obs-1-1-rh">                         
                        <wml2:point>
                            <wml2:MeasurementTVP> 
                                      <wml2:time>2018-10-26T19:20:00Z</wml2:time>
				      <wml2:value>90.0</wml2:value>
                            </wml2:MeasurementTVP>
                        </wml2:point>                         
                    </wml2:MeasurementTimeseries>
                </om:result>

        </omso:PointTimeSeriesObservation>
    </wfs:member>
	    <wfs:member>
                <omso:PointTimeSeriesObservation gml:id="WFS-T_cFQYHiHaGJCbwFwJDg1wuxfC.JTowqYWbbpdOt.Lnl5dsPTTv3c3Trvlw9NGXk6ddNO3L2w7OuXhh08oWliy59O6pp25bUX8Kp08ZxxGNj5c61ItCnHdOmjJq4Z2XdkqaduW1F_CqdNFUkRnZtunnpyc6zGLBg5aOXRry.e._lkv7.2Xl35aemHFsyxMzZh6ZefSJmbN.PDsy1qZtN.NJXdemZw1tuHxE08.mHdjy0rV0IDS24fEXhvx6Oc4Mcze25emXfQw8sO3L0y8udYnTI1tunnz07s9TL46VjTsM5tbuu2fmp9MPTTv3c5wmtx64dmnp5k7s2.Jrc.mHpp37qnnhlrQ38Mu7Jh6YW5z6b.WXJx65eXm_pyVphZtul0634ueXl2w9NO_dzdOu.XD00ZeTp1007cvbDs65eGHTyaHTTty0.mXhM0Omnbltb92WsarUhgA--">

		      
      <om:phenomenonTime xlink:href="#time1-1-1"/>
      <om:resultTime xlink:href="#time2-1-1"/>      

		<om:procedure xlink:href="http://xml.fmi.fi/inspire/process/opendata"/>
   		            <om:parameter>
                <om:NamedValue>
                    <om:name xlink:href="http://inspire.ec.europa.eu/codeList/ProcessParameterValue/value/groundObservation/observationIntent"/>
                    <om:value>
			atmosphere
                    </om:value>
                </om:NamedValue>
            </om:parameter>

                <om:observedProperty  xlink:href="https://opendata.fmi.fi/meta?observableProperty=observation&amp;param=td&amp;language=eng"/>
				<om:featureOfInterest>
                    <sams:SF_SpatialSamplingFeature gml:id="fi-1-1-td">
          <sam:sampledFeature>
		<target:LocationCollection gml:id="sampled-target-1-1-td">
		    <target:member>
		    <target:Location gml:id="obsloc-fmisid-100949-pos-td">
		        <gml:identifier codeSpace="http://xml.fmi.fi/namespace/stationcode/fmisid">100949</gml:identifier>
			<gml:name codeSpace="http://xml.fmi.fi/namespace/locationcode/name">Turku Artukainen</gml:name>
			<gml:name codeSpace="http://xml.fmi.fi/namespace/locationcode/geoid">-16000132</gml:name>
			<gml:name codeSpace="http://xml.fmi.fi/namespace/locationcode/wmo">2773</gml:name>
			<target:representativePoint xlink:href="#point-fmisid-100949-1-1-td"/>
			
			
			<target:region codeSpace="http://xml.fmi.fi/namespace/location/region">Turku</target:region>
			
		    </target:Location></target:member>
		</target:LocationCollection>
 	   </sam:sampledFeature>
                        <sams:shape>
                            
			    <gml:Point gml:id="point-fmisid-100949-1-1-td" srsName="http://www.opengis.net/def/crs/EPSG/0/4258" srsDimension="2">
                                <gml:name>Turku Artukainen</gml:name>
                                <gml:pos>60.45439 22.17870 </gml:pos>
                            </gml:Point>
                            
                        </sams:shape>
                    </sams:SF_SpatialSamplingFeature>
                </om:featureOfInterest>
		  <om:result>
                    <wml2:MeasurementTimeseries gml:id="obs-obs-1-1-td">                         
                        <wml2:point>
                            <wml2:MeasurementTVP> 
                                      <wml2:time>2018-10-26T19:20:00Z</wml2:time>
				      <wml2:value>-0.1</wml2:value>
                            </wml2:MeasurementTVP>
                        </wml2:point>                         
                    </wml2:MeasurementTimeseries>
                </om:result>

        </omso:PointTimeSeriesObservation>
    </wfs:member>
	    <wfs:member>
                <omso:PointTimeSeriesObservation gml:id="WFS-xyolR_9.nw1jd0ZH5i4hSd6uju.JTowqYWbbpdOt.Lnl5dsPTTv3c3Trvlw9NGXk6ddNO3L2w7OuXhh08oWliy59O6pp25bUX8Kp08ZxxGNj5c61ItCnHdOmjJq4Z2XdkqaduW1F_CqdNFUkRnZtunnpyc6zGLBg5aOXRry.e._lkv7.2Xl35aemHFsyxMzZh6ZefSJmbN.PDsy1qZtN.NJXdemZw1tuHxE08.mHdjy0rV0IDS24fEXhvx6Oc4Mcze25emXfQw8sO3L0y8udZHK.x0Nbbp589O7PUy.OlY07DObW7rtn5qfTD00793OcJrceuHZp6eZO7Nvia3Pph6ad.6p54Za0N_DLuyYemFuc.m_llyceuXl5v6claYWbbpdOt.Lnl5dsPTTv3c3Trvlw9NGXk6ddNO3L2w7OuXhh08mh007ctPpl4TNDpp25bW_dlrGq1IYA">

		      
      <om:phenomenonTime xlink:href="#time1-1-1"/>
      <om:resultTime xlink:href="#time2-1-1"/>      

		<om:procedure xlink:href="http://xml.fmi.fi/inspire/process/opendata"/>
   		            <om:parameter>
                <om:NamedValue>
                    <om:name xlink:href="http://inspire.ec.europa.eu/codeList/ProcessParameterValue/value/groundObservation/observationIntent"/>
                    <om:value>
			atmosphere
                    </om:value>
                </om:NamedValue>
            </om:parameter>

                <om:observedProperty  xlink:href="https://opendata.fmi.fi/meta?observableProperty=observation&amp;param=r_1h&amp;language=eng"/>
				<om:featureOfInterest>
                    <sams:SF_SpatialSamplingFeature gml:id="fi-1-1-r_1h">
          <sam:sampledFeature>
		<target:LocationCollection gml:id="sampled-target-1-1-r_1h">
		    <target:member>
		    <target:Location gml:id="obsloc-fmisid-100949-pos-r_1h">
		        <gml:identifier codeSpace="http://xml.fmi.fi/namespace/stationcode/fmisid">100949</gml:identifier>
			<gml:name codeSpace="http://xml.fmi.fi/namespace/locationcode/name">Turku Artukainen</gml:name>
			<gml:name codeSpace="http://xml.fmi.fi/namespace/locationcode/geoid">-16000132</gml:name>
			<gml:name codeSpace="http://xml.fmi.fi/namespace/locationcode/wmo">2773</gml:name>
			<target:representativePoint xlink:href="#point-fmisid-100949-1-1-r_1h"/>
			
			
			<target:region codeSpace="http://xml.fmi.fi/namespace/location/region">Turku</target:region>
			
		    </target:Location></target:member>
		</target:LocationCollection>
 	   </sam:sampledFeature>
                        <sams:shape>
                            
			    <gml:Point gml:id="point-fmisid-100949-1-1-r_1h" srsName="http://www.opengis.net/def/crs/EPSG/0/4258" srsDimension="2">
                                <gml:name>Turku Artukainen</gml:name>
                                <gml:pos>60.45439 22.17870 </gml:pos>
                            </gml:Point>
                            
                        </sams:shape>
                    </sams:SF_SpatialSamplingFeature>
                </om:featureOfInterest>
		  <om:result>
                    <wml2:MeasurementTimeseries gml:id="obs-obs-1-1-r_1h">                         
                        <wml2:point>
                            <wml2:MeasurementTVP> 
                                      <wml2:time>2018-10-26T19:20:00Z</wml2:time>
				      <wml2:value>NaN</wml2:value>
                            </wml2:MeasurementTVP>
                        </wml2:point>                         
                    </wml2:MeasurementTimeseries>
                </om:result>

        </omso:PointTimeSeriesObservation>
    </wfs:member>
	    <wfs:member>
                <omso:PointTimeSeriesObservation gml:id="WFS-UGYu0pjRj79qsBfj2bel2ZBZnr2JTowqYWbbpdOt.Lnl5dsPTTv3c3Trvlw9NGXk6ddNO3L2w7OuXhh08oWliy59O6pp25bUX8Kp08ZxxGNj5c61ItCnHdOmjJq4Z2XdkqaduW1F_CqdNFUkRnZtunnpyc6zGLBg5aOXRry.e._lkv7.2Xl35aemHFsyxMzZh6ZefSJmbN.PDsy1qZtN.NJXdemZw1tuHxE08.mHdjy0rV0IDS24fEXhvx6Oc4Mcze25emXfQw8sO3L0y8udaHLTfYsNunc1tunnz07s9TL46VjTsM5tbuu2fmp9MPTTv3c5wmtx64dmnp5k7s2.Jrc.mHpp37qnnhlrQ38Mu7Jh6YW5z6b.WXJx65eXm_pyVphZtul0634ueXl2w9NO_dzdOu.XD00ZeTp1007cvbDs65eGHTyaHTTty0.mXhM0Omnbltb92WsarUhg">

		      
      <om:phenomenonTime xlink:href="#time1-1-1"/>
      <om:resultTime xlink:href="#time2-1-1"/>      

		<om:procedure xlink:href="http://xml.fmi.fi/inspire/process/opendata"/>
   		            <om:parameter>
                <om:NamedValue>
                    <om:name xlink:href="http://inspire.ec.europa.eu/codeList/ProcessParameterValue/value/groundObservation/observationIntent"/>
                    <om:value>
			atmosphere
                    </om:value>
                </om:NamedValue>
            </om:parameter>

                <om:observedProperty  xlink:href="https://opendata.fmi.fi/meta?observableProperty=observation&amp;param=ri_10min&amp;language=eng"/>
				<om:featureOfInterest>
                    <sams:SF_SpatialSamplingFeature gml:id="fi-1-1-ri_10min">
          <sam:sampledFeature>
		<target:LocationCollection gml:id="sampled-target-1-1-ri_10min">
		    <target:member>
		    <target:Location gml:id="obsloc-fmisid-100949-pos-ri_10min">
		        <gml:identifier codeSpace="http://xml.fmi.fi/namespace/stationcode/fmisid">100949</gml:identifier>
			<gml:name codeSpace="http://xml.fmi.fi/namespace/locationcode/name">Turku Artukainen</gml:name>
			<gml:name codeSpace="http://xml.fmi.fi/namespace/locationcode/geoid">-16000132</gml:name>
			<gml:name codeSpace="http://xml.fmi.fi/namespace/locationcode/wmo">2773</gml:name>
			<target:representativePoint xlink:href="#point-fmisid-100949-1-1-ri_10min"/>
			
			
			<target:region codeSpace="http://xml.fmi.fi/namespace/location/region">Turku</target:region>
			
		    </target:Location></target:member>
		</target:LocationCollection>
 	   </sam:sampledFeature>
                        <sams:shape>
                            
			    <gml:Point gml:id="point-fmisid-100949-1-1-ri_10min" srsName="http://www.opengis.net/def/crs/EPSG/0/4258" srsDimension="2">
                                <gml:name>Turku Artukainen</gml:name>
                                <gml:pos>60.45439 22.17870 </gml:pos>
                            </gml:Point>
                            
                        </sams:shape>
                    </sams:SF_SpatialSamplingFeature>
                </om:featureOfInterest>
		  <om:result>
                    <wml2:MeasurementTimeseries gml:id="obs-obs-1-1-ri_10min">                         
                        <wml2:point>
                            <wml2:MeasurementTVP> 
                                      <wml2:time>2018-10-26T19:20:00Z</wml2:time>
				      <wml2:value>0.0</wml2:value>
                            </wml2:MeasurementTVP>
                        </wml2:point>                         
                    </wml2:MeasurementTimeseries>
                </om:result>

        </omso:PointTimeSeriesObservation>
    </wfs:member>
	    <wfs:member>
                <omso:PointTimeSeriesObservation gml:id="WFS-JGbhtp2h.T_rPVfORJZV3Wh7ENKJTowqYWbbpdOt.Lnl5dsPTTv3c3Trvlw9NGXk6ddNO3L2w7OuXhh08oWliy59O6pp25bUX8Kp08ZxxGNj5c61ItCnHdOmjJq4Z2XdkqaduW1F_CqdNFUkRnZtunnpyc6zGLBg5aOXRry.e._lkv7.2Xl35aemHFsyxMzZh6ZefSJmbN.PDsy1qZtN.NJXdemZw1tuHxE08.mHdjy0rV0IDS24fEXhvx6Oc4Mcze25emXfQw8sO3L0y8udaHPdv738Pfm1tunnz07s9TL46VjTsM5tbuu2fmp9MPTTv3c5wmtx64dmnp5k7s2.Jrc.mHpp37qnnhlrQ38Mu7Jh6YW5z6b.WXJx65eXm_pyVphZtul0634ueXl2w9NO_dzdOu.XD00ZeTp1007cvbDs65eGHTyaHTTty0.mXhM0Omnbltb92WsarUhg">

		      
      <om:phenomenonTime xlink:href="#time1-1-1"/>
      <om:resultTime xlink:href="#time2-1-1"/>      

		<om:procedure xlink:href="http://xml.fmi.fi/inspire/process/opendata"/>
   		            <om:parameter>
                <om:NamedValue>
                    <om:name xlink:href="http://inspire.ec.europa.eu/codeList/ProcessParameterValue/value/groundObservation/observationIntent"/>
                    <om:value>
			atmosphere
                    </om:value>
                </om:NamedValue>
            </om:parameter>

                <om:observedProperty  xlink:href="https://opendata.fmi.fi/meta?observableProperty=observation&amp;param=snow_aws&amp;language=eng"/>
				<om:featureOfInterest>
                    <sams:SF_SpatialSamplingFeature gml:id="fi-1-1-snow_aws">
          <sam:sampledFeature>
		<target:LocationCollection gml:id="sampled-target-1-1-snow_aws">
		    <target:member>
		    <target:Location gml:id="obsloc-fmisid-100949-pos-snow_aws">
		        <gml:identifier codeSpace="http://xml.fmi.fi/namespace/stationcode/fmisid">100949</gml:identifier>
			<gml:name codeSpace="http://xml.fmi.fi/namespace/locationcode/name">Turku Artukainen</gml:name>
			<gml:name codeSpace="http://xml.fmi.fi/namespace/locationcode/geoid">-16000132</gml:name>
			<gml:name codeSpace="http://xml.fmi.fi/namespace/locationcode/wmo">2773</gml:name>
			<target:representativePoint xlink:href="#point-fmisid-100949-1-1-snow_aws"/>
			
			
			<target:region codeSpace="http://xml.fmi.fi/namespace/location/region">Turku</target:region>
			
		    </target:Location></target:member>
		</target:LocationCollection>
 	   </sam:sampledFeature>
                        <sams:shape>
                            
			    <gml:Point gml:id="point-fmisid-100949-1-1-snow_aws" srsName="http://www.opengis.net/def/crs/EPSG/0/4258" srsDimension="2">
                                <gml:name>Turku Artukainen</gml:name>
                                <gml:pos>60.45439 22.17870 </gml:pos>
                            </gml:Point>
                            
                        </sams:shape>
                    </sams:SF_SpatialSamplingFeature>
                </om:featureOfInterest>
		  <om:result>
                    <wml2:MeasurementTimeseries gml:id="obs-obs-1-1-snow_aws">                         
                        <wml2:point>
                            <wml2:MeasurementTVP> 
                                      <wml2:time>2018-10-26T19:20:00Z</wml2:time>
				      <wml2:value>0.0</wml2:value>
                            </wml2:MeasurementTVP>
                        </wml2:point>                         
                    </wml2:MeasurementTimeseries>
                </om:result>

        </omso:PointTimeSeriesObservation>
    </wfs:member>
	    <wfs:member>
                <omso:PointTimeSeriesObservation gml:id="WFS-vCuglBMVlJyFh11nIaqUZ7Fotf6JTowqYWbbpdOt.Lnl5dsPTTv3c3Trvlw9NGXk6ddNO3L2w7OuXhh08oWliy59O6pp25bUX8Kp08ZxxGNj5c61ItCnHdOmjJq4Z2XdkqaduW1F_CqdNFUkRnZtunnpyc6zGLBg5aOXRry.e._lkv7.2Xl35aemHFsyxMzZh6ZefSJmbN.PDsy1qZtN.NJXdemZw1tuHxE08.mHdjy0rV0IDS24fEXhvx6Oc4Mcze25emXfQw8sO3L0y8udZXC_zy4Wtt08.endnqZfHSsadhnNrd12z81Pph6ad.7nOE1uPXDs09PMndm3xNbn0w9NO_dU88MtaG_hl3ZMPTC3OfTfyy5OPXLy839OStMLNt0unW_Fzy8u2Hpp37ubp13y4emjLydOumnbl7YdnXLww6eTQ6aduWn0y8Jmh007ctrfuy1jVakM">

		      
      <om:phenomenonTime xlink:href="#time1-1-1"/>
      <om:resultTime xlink:href="#time2-1-1"/>      

		<om:procedure xlink:href="http://xml.fmi.fi/inspire/process/opendata"/>
   		            <om:parameter>
                <om:NamedValue>
                    <om:name xlink:href="http://inspire.ec.europa.eu/codeList/ProcessParameterValue/value/groundObservation/observationIntent"/>
                    <om:value>
			atmosphere
                    </om:value>
                </om:NamedValue>
            </om:parameter>

                <om:observedProperty  xlink:href="https://opendata.fmi.fi/meta?observableProperty=observation&amp;param=p_sea&amp;language=eng"/>
				<om:featureOfInterest>
                    <sams:SF_SpatialSamplingFeature gml:id="fi-1-1-p_sea">
          <sam:sampledFeature>
		<target:LocationCollection gml:id="sampled-target-1-1-p_sea">
		    <target:member>
		    <target:Location gml:id="obsloc-fmisid-100949-pos-p_sea">
		        <gml:identifier codeSpace="http://xml.fmi.fi/namespace/stationcode/fmisid">100949</gml:identifier>
			<gml:name codeSpace="http://xml.fmi.fi/namespace/locationcode/name">Turku Artukainen</gml:name>
			<gml:name codeSpace="http://xml.fmi.fi/namespace/locationcode/geoid">-16000132</gml:name>
			<gml:name codeSpace="http://xml.fmi.fi/namespace/locationcode/wmo">2773</gml:name>
			<target:representativePoint xlink:href="#point-fmisid-100949-1-1-p_sea"/>
			
			
			<target:region codeSpace="http://xml.fmi.fi/namespace/location/region">Turku</target:region>
			
		    </target:Location></target:member>
		</target:LocationCollection>
 	   </sam:sampledFeature>
                        <sams:shape>
                            
			    <gml:Point gml:id="point-fmisid-100949-1-1-p_sea" srsName="http://www.opengis.net/def/crs/EPSG/0/4258" srsDimension="2">
                                <gml:name>Turku Artukainen</gml:name>
                                <gml:pos>60.45439 22.17870 </gml:pos>
                            </gml:Point>
                            
                        </sams:shape>
                    </sams:SF_SpatialSamplingFeature>
                </om:featureOfInterest>
		  <om:result>
                    <wml2:MeasurementTimeseries gml:id="obs-obs-1-1-p_sea">                         
                        <wml2:point>
                            <wml2:MeasurementTVP> 
                                      <wml2:time>2018-10-26T19:20:00Z</wml2:time>
				      <wml2:value>1003.7</wml2:value>
                            </wml2:MeasurementTVP>
                        </wml2:point>                         
                    </wml2:MeasurementTimeseries>
                </om:result>

        </omso:PointTimeSeriesObservation>
    </wfs:member>
	    <wfs:member>
                <omso:PointTimeSeriesObservation gml:id="WFS-3RpDj0OIdRgk9LeA9CClhUSIBm2JTowqYWbbpdOt.Lnl5dsPTTv3c3Trvlw9NGXk6ddNO3L2w7OuXhh08oWliy59O6pp25bUX8Kp08ZxxGNj5c61ItCnHdOmjJq4Z2XdkqaduW1F_CqdNFUkRnZtunnpyc6zGLBg5aOXRry.e._lkv7.2Xl35aemHFsyxMzZh6ZefSJmbN.PDsy1qZtN.NJXdemZw1tuHxE08.mHdjy0rV0IDS24fEXhvx6Oc4Mcze25emXfQw8sO3L0y8udY3bTza23Tz56d2epl8dKxp2Gc2t3XbPzU.mHpp37uc4TW49cOzT08yd2bfE1ufTD00791Tzwy1ob.GXdkw9MLc59N_LLk49cvLzf05K0ws23S6db8XPLy7Yemnfu5unXfLh6aMvJ066aduXth2dcvDDp5NDpp25afTLwmaHTTty2t.7LWNVqQwA-">

		      
      <om:phenomenonTime xlink:href="#time1-1-1"/>
      <om:resultTime xlink:href="#time2-1-1"/>      

		<om:procedure xlink:href="http://xml.fmi.fi/inspire/process/opendata"/>
   		            <om:parameter>
                <om:NamedValue>
                    <om:name xlink:href="http://inspire.ec.europa.eu/codeList/ProcessParameterValue/value/groundObservation/observationIntent"/>
                    <om:value>
			atmosphere
                    </om:value>
                </om:NamedValue>
            </om:parameter>

                <om:observedProperty  xlink:href="https://opendata.fmi.fi/meta?observableProperty=observation&amp;param=vis&amp;language=eng"/>
				<om:featureOfInterest>
                    <sams:SF_SpatialSamplingFeature gml:id="fi-1-1-vis">
          <sam:sampledFeature>
		<target:LocationCollection gml:id="sampled-target-1-1-vis">
		    <target:member>
		    <target:Location gml:id="obsloc-fmisid-100949-pos-vis">
		        <gml:identifier codeSpace="http://xml.fmi.fi/namespace/stationcode/fmisid">100949</gml:identifier>
			<gml:name codeSpace="http://xml.fmi.fi/namespace/locationcode/name">Turku Artukainen</gml:name>
			<gml:name codeSpace="http://xml.fmi.fi/namespace/locationcode/geoid">-16000132</gml:name>
			<gml:name codeSpace="http://xml.fmi.fi/namespace/locationcode/wmo">2773</gml:name>
			<target:representativePoint xlink:href="#point-fmisid-100949-1-1-vis"/>
			
			
			<target:region codeSpace="http://xml.fmi.fi/namespace/location/region">Turku</target:region>
			
		    </target:Location></target:member>
		</target:LocationCollection>
 	   </sam:sampledFeature>
                        <sams:shape>
                            
			    <gml:Point gml:id="point-fmisid-100949-1-1-vis" srsName="http://www.opengis.net/def/crs/EPSG/0/4258" srsDimension="2">
                                <gml:name>Turku Artukainen</gml:name>
                                <gml:pos>60.45439 22.17870 </gml:pos>
                            </gml:Point>
                            
                        </sams:shape>
                    </sams:SF_SpatialSamplingFeature>
                </om:featureOfInterest>
		  <om:result>
                    <wml2:MeasurementTimeseries gml:id="obs-obs-1-1-vis">                         
                        <wml2:point>
                            <wml2:MeasurementTVP> 
                                      <wml2:time>2018-10-26T19:20:00Z</wml2:time>
				      <wml2:value>42490.0</wml2:value>
                            </wml2:MeasurementTVP>
                        </wml2:point>                         
                    </wml2:MeasurementTimeseries>
                </om:result>

        </omso:PointTimeSeriesObservation>
    </wfs:member>
	    <wfs:member>
                <omso:PointTimeSeriesObservation gml:id="WFS-pV.4tzPagAgPhPp64JZp9WM0l4iJTowqYWbbpdOt.Lnl5dsPTTv3c3Trvlw9NGXk6ddNO3L2w7OuXhh08oWliy59O6pp25bUX8Kp08ZxxGNj5c61ItCnHdOmjJq4Z2XdkqaduW1F_CqdNFUkRnZtunnpyc6zGLBg5aOXRry.e._lkv7.2Xl35aemHFsyxMzZh6ZefSJmbN.PDsy1qZtN.NJXdemZw1tuHxE08.mHdjy0rV0IDS24fEXhvx6Oc4Mcze25emXfQw8sO3L0y8udZW6_tw7mtt08.endnqZfHSsadhnNrd12z81Pph6ad.7nOE1uPXDs09PMndm3xNbn0w9NO_dU88MtaG_hl3ZMPTC3OfTfyy5OPXLy839OStMLNt0unW_Fzy8u2Hpp37ubp13y4emjLydOumnbl7YdnXLww6eTQ6aduWn0y8Jmh007ctrfuy1jVakM">

		      
      <om:phenomenonTime xlink:href="#time1-1-1"/>
      <om:resultTime xlink:href="#time2-1-1"/>      

		<om:procedure xlink:href="http://xml.fmi.fi/inspire/process/opendata"/>
   		            <om:parameter>
                <om:NamedValue>
                    <om:name xlink:href="http://inspire.ec.europa.eu/codeList/ProcessParameterValue/value/groundObservation/observationIntent"/>
                    <om:value>
			atmosphere
                    </om:value>
                </om:NamedValue>
            </om:parameter>

                <om:observedProperty  xlink:href="https://opendata.fmi.fi/meta?observableProperty=observation&amp;param=n_man&amp;language=eng"/>
				<om:featureOfInterest>
                    <sams:SF_SpatialSamplingFeature gml:id="fi-1-1-n_man">
          <sam:sampledFeature>
		<target:LocationCollection gml:id="sampled-target-1-1-n_man">
		    <target:member>
		    <target:Location gml:id="obsloc-fmisid-100949-pos-n_man">
		        <gml:identifier codeSpace="http://xml.fmi.fi/namespace/stationcode/fmisid">100949</gml:identifier>
			<gml:name codeSpace="http://xml.fmi.fi/namespace/locationcode/name">Turku Artukainen</gml:name>
			<gml:name codeSpace="http://xml.fmi.fi/namespace/locationcode/geoid">-16000132</gml:name>
			<gml:name codeSpace="http://xml.fmi.fi/namespace/locationcode/wmo">2773</gml:name>
			<target:representativePoint xlink:href="#point-fmisid-100949-1-1-n_man"/>
			
			
			<target:region codeSpace="http://xml.fmi.fi/namespace/location/region">Turku</target:region>
			
		    </target:Location></target:member>
		</target:LocationCollection>
 	   </sam:sampledFeature>
                        <sams:shape>
                            
			    <gml:Point gml:id="point-fmisid-100949-1-1-n_man" srsName="http://www.opengis.net/def/crs/EPSG/0/4258" srsDimension="2">
                                <gml:name>Turku Artukainen</gml:name>
                                <gml:pos>60.45439 22.17870 </gml:pos>
                            </gml:Point>
                            
                        </sams:shape>
                    </sams:SF_SpatialSamplingFeature>
                </om:featureOfInterest>
		  <om:result>
                    <wml2:MeasurementTimeseries gml:id="obs-obs-1-1-n_man">                         
                        <wml2:point>
                            <wml2:MeasurementTVP> 
                                      <wml2:time>2018-10-26T19:20:00Z</wml2:time>
				      <wml2:value>8.0</wml2:value>
                            </wml2:MeasurementTVP>
                        </wml2:point>                         
                    </wml2:MeasurementTimeseries>
                </om:result>

        </omso:PointTimeSeriesObservation>
    </wfs:member>
	    <wfs:member>
                <omso:PointTimeSeriesObservation gml:id="WFS-r2N3cE_gTkBx0FxTTo1UwBOdB.yJTowqYWbbpdOt.Lnl5dsPTTv3c3Trvlw9NGXk6ddNO3L2w7OuXhh08oWliy59O6pp25bUX8Kp08ZxxGNj5c61ItCnHdOmjJq4Z2XdkqaduW1F_CqdNFUkRnZtunnpyc6zGLBg5aOXRry.e._lkv7.2Xl35aemHFsyxMzZh6ZefSJmbN.PDsy1qZtN.NJXdemZw1tuHxE08.mHdjy0rV0IDS24fEXhvx6Oc4Mcze25emXfQw8sO3L0y8udZHfD3wtbbp589O7PUy.OlY07DObW7rtn5qfTD00793OcJrceuHZp6eZO7Nvia3Pph6ad.6p54Za0N_DLuyYemFuc.m_llyceuXl5v6claYWbbpdOt.Lnl5dsPTTv3c3Trvlw9NGXk6ddNO3L2w7OuXhh08mh007ctPpl4TNDpp25bW_dlrGq1IYA">

		      
      <om:phenomenonTime xlink:href="#time1-1-1"/>
      <om:resultTime xlink:href="#time2-1-1"/>      

		<om:procedure xlink:href="http://xml.fmi.fi/inspire/process/opendata"/>
   		            <om:parameter>
                <om:NamedValue>
                    <om:name xlink:href="http://inspire.ec.europa.eu/codeList/ProcessParameterValue/value/groundObservation/observationIntent"/>
                    <om:value>
			atmosphere
                    </om:value>
                </om:NamedValue>
            </om:parameter>

                <om:observedProperty  xlink:href="https://opendata.fmi.fi/meta?observableProperty=observation&amp;param=wawa&amp;language=eng"/>
				<om:featureOfInterest>
                    <sams:SF_SpatialSamplingFeature gml:id="fi-1-1-wawa">
          <sam:sampledFeature>
		<target:LocationCollection gml:id="sampled-target-1-1-wawa">
		    <target:member>
		    <target:Location gml:id="obsloc-fmisid-100949-pos-wawa">
		        <gml:identifier codeSpace="http://xml.fmi.fi/namespace/stationcode/fmisid">100949</gml:identifier>
			<gml:name codeSpace="http://xml.fmi.fi/namespace/locationcode/name">Turku Artukainen</gml:name>
			<gml:name codeSpace="http://xml.fmi.fi/namespace/locationcode/geoid">-16000132</gml:name>
			<gml:name codeSpace="http://xml.fmi.fi/namespace/locationcode/wmo">2773</gml:name>
			<target:representativePoint xlink:href="#point-fmisid-100949-1-1-wawa"/>
			
			
			<target:region codeSpace="http://xml.fmi.fi/namespace/location/region">Turku</target:region>
			
		    </target:Location></target:member>
		</target:LocationCollection>
 	   </sam:sampledFeature>
                        <sams:shape>
                            
			    <gml:Point gml:id="point-fmisid-100949-1-1-wawa" srsName="http://www.opengis.net/def/crs/EPSG/0/4258" srsDimension="2">
                                <gml:name>Turku Artukainen</gml:name>
                                <gml:pos>60.45439 22.17870 </gml:pos>
                            </gml:Point>
                            
                        </sams:shape>
                    </sams:SF_SpatialSamplingFeature>
                </om:featureOfInterest>
		  <om:result>
                    <wml2:MeasurementTimeseries gml:id="obs-obs-1-1-wawa">                         
                        <wml2:point>
                            <wml2:MeasurementTVP> 
                                      <wml2:time>2018-10-26T19:20:00Z</wml2:time>
				      <wml2:value>0.0</wml2:value>
                            </wml2:MeasurementTVP>
                        </wml2:point>                         
                    </wml2:MeasurementTimeseries>
                </om:result>

        </omso:PointTimeSeriesObservation>
    </wfs:member>
</wfs:FeatureCollection>`;

export default observation;
