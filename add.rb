#!/usr/bin/env ruby

require "json"
require "geocoder"

url = ARGV[0]

city = url.match(/place\/([^,\/]+)/)[1]
m = url.match(/@([-\d\.]+),([-\d\.]+)/)
coords = [m[1], m[2]].map(&:to_f)

result = Geocoder.search(coords).first

h =
  {
    city_id: result.place_id,
    title_en: city,
    country_ru: result.country,
    country_en: result.country,
    image_url: "",
    title_ru: city,
    y: coords[0],
    x: coords[1]
  }

p result
p h

cities_path = "site/tripster_cities.json"

arr = JSON.parse(File.open(cities_path).read, symbolize_names: true)
arr << h

arr = arr
  .map { |point| point.delete_if { |k,v| %i[want visited been_count been_count_msg country_url city_url].include? k } }
  .uniq { |point| point[:city_id] }
  .sort_by { |point| %i[country_en title_en].map { |k| point[k] } }

File.open(cities_path, "w") do |file|
  file.write(JSON.pretty_generate(arr))
end
