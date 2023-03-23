import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.trim().toLowerCase();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (err) {
      this.handleExeption(err);
    }
  }

  async findAll() {
    return await this.pokemonModel.find();
  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    } else if (isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    } else {
      pokemon = await this.pokemonModel.findOne({ name: term });
    }

    if (!pokemon)
      throw new NotFoundException(
        `Pokemon with id, no, or name (${term}) not found`,
      );
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);
    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.trim().toLowerCase();

    try {
      await this.pokemonModel.updateOne(updatePokemonDto);
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (err) {
      this.handleExeption(err);
    }
  }

  async remove(id: string) {
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
    if (deletedCount === 0)
      throw new BadRequestException(`Pokemon with id ${id} not found`);
  }

  private handleExeption(err: any) {
    if (err.code === 11000) {
      throw new BadRequestException(
        `Pokemon exist in database ${JSON.stringify(err.keyValue)}`,
      );
    }
    throw new InternalServerErrorException(
      `Can't resolve Pokemon - Check server logs`,
    );
  }
}
