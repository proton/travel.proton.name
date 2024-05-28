#!/usr/bin/env ruby

require "json"
require "geocoder"

Geocoder.configure(
 timeout: 10,
 lookup: :nominatim,
 http_headers: { "User-Agent" => "Petr Savichev (psavichev@gmail.com)" },
)

url = ARGV[0]

city = url.match(/place\/([^,\/]+)/)[1]
m = url.match(/@([-\d\.]+),([-\d\.]+)/)
coords = [m[1], m[2]].map(&:to_f)

result = Geocoder.search(coords).first

h =
  {
    city_id: result.place_id,
    title_en: city,
    state_en: result.state,
    country_ru: result.country,
    country_en: result.country,
    image_url: "",
    title_ru: city,
    y: coords[0],
    x: coords[1]
  }
cities_path = "site/tripster_cities.json"

arr = JSON.parse(File.open(cities_path).read, symbolize_names: true)
arr << h

arr = arr
  .map { |point| point.delete_if { |k,v| %i[want visited been_count been_count_msg country_url city_url].include? k } }
  .map { |point| %i[title_en title_ru].each { |k| point[k] = point[k].gsub("+", " ") if point[k] }; point }
  .uniq { |point| point[:city_id] }
  .sort_by { |point| %i[country_en title_en].map { |k| point[k] } }

similar = arr.select { |eh| eh[:title_en] == h[:title_en] && eh[:country_en] == h[:country_en] }
if similar.size > 1
  puts "Duplicates: #{similar.size - 1}"
  p similar
else
  puts "no duplicates ^_^"
end

File.open(cities_path, "w") do |file|
  file.write(JSON.pretty_generate(arr))
end
